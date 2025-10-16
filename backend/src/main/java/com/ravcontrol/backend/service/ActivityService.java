package com.ravcontrol.backend.service;

import com.ravcontrol.backend.dto.activity.request.CreateActivityRequestDTO;
import com.ravcontrol.backend.dto.activity.request.MoveActivityRequestDTO;
import com.ravcontrol.backend.dto.activity.request.UpdateActivityRequestDTO;
import com.ravcontrol.backend.dto.activity.response.ActivityResponseDTO;
import com.ravcontrol.backend.dto.activity.response.OverdueCountDTO;
import com.ravcontrol.backend.dto.activity.response.SearchActivityResponseDTO;
import com.ravcontrol.backend.entity.Activity;
import com.ravcontrol.backend.entity.ActivityGroup;
import com.ravcontrol.backend.repository.ActivityGroupRepository;
import com.ravcontrol.backend.repository.ActivityRepository;
import com.ravcontrol.backend.service.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final ActivityGroupRepository groupRepository;

    @Autowired
    public ActivityService(ActivityRepository activityRepository, ActivityGroupRepository groupRepository) {
        this.activityRepository = activityRepository;
        this.groupRepository = groupRepository;
    }

    @Transactional
    public ActivityResponseDTO createActivity(CreateActivityRequestDTO dto) {
        ActivityGroup group = groupRepository
            .findById(dto.groupId())
            .orElseThrow(() -> new ResourceNotFoundException("Grupo não encontrado para o ID" + dto.groupId()));

        int nextPosition = activityRepository.countByGroupId(group.getId());

        Activity newActivity = new Activity();
        newActivity.setName(dto.name());
        newActivity.setDescription(dto.description());
        newActivity.setDueDate(dto.dueDate());
        newActivity.attachToGroup(group, nextPosition);

        Activity savedActivity = activityRepository.save(newActivity);
        return ActivityResponseDTO.fromEntity(savedActivity);
    }

    @Transactional
    public ActivityResponseDTO updateActivity(Long activityId, UpdateActivityRequestDTO dto) {
        Activity activity = activityRepository
            .findById(activityId)
            .orElseThrow(() -> new ResourceNotFoundException("Atividade não encontrada para o ID" + activityId));

        if (dto.name() != null) {
            activity.setName(dto.name());
        }
        if (dto.description() != null) {
            activity.setDescription(dto.description());
        }
        if (dto.dueDate() != null) {
            activity.setDueDate(dto.dueDate());
        }
        if (dto.completed() != null) {
            activity.setCompleted(dto.completed());
        }

        Activity updatedActivity = activityRepository.save(activity);
        return ActivityResponseDTO.fromEntity(updatedActivity);
    }

    @Transactional
    public ActivityResponseDTO moveActivity(Long activityId, MoveActivityRequestDTO dto) {
        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(() -> new ResourceNotFoundException("Atividade não encontrada com o ID " + activityId));

        ActivityGroup targetGroup = groupRepository.findById(dto.targetGroupId())
            .orElseThrow(() -> new ResourceNotFoundException("Grupo de destino não encontrado com o ID " + dto.targetGroupId()));

        ActivityGroup sourceGroup = activity.getGroup();

        if (activity.getGroup().equals(targetGroup)
            && activity.getPosition().equals(dto.newPosition()
        )) {
            return ActivityResponseDTO.fromEntity(activity);
        }

        sourceGroup.removeActivity(activity);
        targetGroup.addActivity(activity, dto.newPosition());

        reorderPositions(sourceGroup.getActivities());
        reorderPositions(targetGroup.getActivities());

        groupRepository.saveAll(List.of(sourceGroup, targetGroup));
        activityRepository.save(activity);

        return ActivityResponseDTO.fromEntity(activity);
    }

    @Transactional
    public void deleteActivity(Long activityId) {
        Activity activityToDelete = activityRepository.findById(activityId)
            .orElseThrow(() -> new ResourceNotFoundException("Atividade não encontrada com o ID: " + activityId));

        ActivityGroup group = activityToDelete.getGroup();
        group.getActivities().remove(activityToDelete);
        reorderPositions(group.getActivities());

        activityRepository.delete(activityToDelete);
    }

    @Transactional(readOnly = true)
    public List<SearchActivityResponseDTO> searchActivities(String query) {
        List<Activity> activities = activityRepository.findByNameContainingIgnoreCase(query);
        return activities
            .stream()
            .map(activity -> new SearchActivityResponseDTO(
                activity.getId(),
                activity.getName(),
                activity.getDescription(),
                activity.getDueDate(),
                activity.getCompleted(),
                activity.getGroup().getId(),
                activity.getGroup().getName()
        ))
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OverdueCountDTO getOverdueActivitiesCount() {
        int count = activityRepository.countByDueDateBeforeAndCompletedIsFalse(LocalDate.now());
        return new OverdueCountDTO(count);
    }

    private void reorderPositions(List<Activity> activities) {
        for (int i = 0; i < activities.size(); i++) {
            activities.get(i).setPosition(i);
        }
    }
}

