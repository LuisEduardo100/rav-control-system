package com.ravcontrol.backend.controller;

import com.ravcontrol.backend.dto.activity.request.CreateActivityRequestDTO;
import com.ravcontrol.backend.dto.activity.request.MoveActivityRequestDTO;
import com.ravcontrol.backend.dto.activity.request.UpdateActivityRequestDTO;
import com.ravcontrol.backend.dto.activity.response.ActivityResponseDTO;
import com.ravcontrol.backend.dto.activity.response.OverdueCountDTO;
import com.ravcontrol.backend.dto.activity.response.SearchActivityResponseDTO;
import com.ravcontrol.backend.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    @Autowired
    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    public ResponseEntity<ActivityResponseDTO> createActivity(@Valid @RequestBody CreateActivityRequestDTO dto) {
        ActivityResponseDTO createdActivity = activityService.createActivity(dto);
        return new ResponseEntity<>(createdActivity,HttpStatus.CREATED);
    }

    @PutMapping("/{activityId}")
    public ResponseEntity<ActivityResponseDTO> updatedActivity(
        @PathVariable Long activityId,
        @Valid @RequestBody UpdateActivityRequestDTO dto
    ) {
        ActivityResponseDTO updatedActivity = activityService.updateActivity(activityId, dto);
        return ResponseEntity.ok(updatedActivity);
    }

    @PatchMapping("/{activityId}/move")
    public ResponseEntity<ActivityResponseDTO> moveActivity(
        @PathVariable Long activityId,
        @Valid @RequestBody MoveActivityRequestDTO dto
    ) {
        ActivityResponseDTO movedActivity = activityService.moveActivity(activityId, dto);
        return ResponseEntity.ok(movedActivity);
    }

    @GetMapping("/search")
    public ResponseEntity<List<SearchActivityResponseDTO>> searchActivities(@RequestParam("q") String query) {
        List<SearchActivityResponseDTO> results = activityService.searchActivities(query);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/overdue-count")
    public ResponseEntity<OverdueCountDTO> getOverdueCount() {
        OverdueCountDTO count = activityService.getOverdueActivitiesCount();
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/{activityId")
    public ResponseEntity<Void> deleteActivity(
        @PathVariable Long activityId
    ) {
        activityService.deleteActivity(activityId);
        return ResponseEntity.noContent().build();
    }
}
