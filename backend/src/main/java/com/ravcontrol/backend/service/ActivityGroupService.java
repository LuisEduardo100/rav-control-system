package com.ravcontrol.backend.service;

import com.ravcontrol.backend.dto.activityGroup.request.ActivityGroupRequestDTO;
import com.ravcontrol.backend.dto.activityGroup.response.ActivityGroupResponseDTO;
import com.ravcontrol.backend.entity.Activity;
import com.ravcontrol.backend.entity.ActivityGroup;
import com.ravcontrol.backend.repository.ActivityGroupRepository;
import com.ravcontrol.backend.service.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityGroupService {
    private final ActivityGroupRepository groupRepository;

    @Autowired
    public ActivityGroupService(ActivityGroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    @Transactional(readOnly = true)
    public List<ActivityGroupResponseDTO> findAllGroups() {
        List<ActivityGroup> groups = groupRepository.findAllByOrderByPositionAsc();
        return groups
            .stream()
            .map(ActivityGroupResponseDTO::fromEntity) // method reference que substitui o método lambda
            .collect(Collectors.toList()); // por que Collectors.toList()?
    }

    @Transactional
    public ActivityGroupResponseDTO createGroup(ActivityGroupRequestDTO dto) {
        long nextPosition = groupRepository.count();

        ActivityGroup newGroup = new ActivityGroup();
        newGroup.setName(dto.name());
        newGroup.setPosition((int) nextPosition);

        ActivityGroup savedGroup = groupRepository.save(newGroup);
        return ActivityGroupResponseDTO.fromEntity(savedGroup);
    }

    @Transactional
    public ActivityGroupResponseDTO updateGroup(Long groupId, ActivityGroupRequestDTO dto) {
        ActivityGroup group = groupRepository
            .findById(groupId).
            orElseThrow(() -> new ResourceNotFoundException("Grupo não encontrado para o ID" + groupId));

        group.setName(dto.name());
        ActivityGroup updatedGroup = groupRepository.save(group);

        return ActivityGroupResponseDTO.fromEntity(updatedGroup);
    }

    @Transactional
    public void deleteGroup(Long groupId) {
        if (!groupRepository.existsById(groupId)) {
            throw new ResourceNotFoundException("Grupo não encontrado para o ID" + groupId);
        }

        groupRepository.deleteById(groupId);

        List<ActivityGroup> remainingGroups = groupRepository.findAllByOrderByPositionAsc();
        reorderPositions(remainingGroups);
        groupRepository.saveAll(remainingGroups);
    }

    private void reorderPositions(List<ActivityGroup> groups) {
        for (int i = 0; i < groups.size(); i++) {
            groups.get(i).setPosition(i);
        }
    }
}
