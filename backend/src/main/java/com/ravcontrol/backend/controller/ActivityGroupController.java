package com.ravcontrol.backend.controller;

import com.ravcontrol.backend.dto.activityGroup.request.ActivityGroupRequestDTO;
import com.ravcontrol.backend.dto.activityGroup.response.ActivityGroupResponseDTO;
import com.ravcontrol.backend.service.ActivityGroupService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class ActivityGroupController {

    private final ActivityGroupService groupService;

    @Autowired
    public ActivityGroupController(ActivityGroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping
    public ResponseEntity<List<ActivityGroupResponseDTO>> getAllGroups() {
        List<ActivityGroupResponseDTO> groups = groupService.findAllGroups();
        return ResponseEntity.ok(groups);
    }

    @PostMapping
    public ResponseEntity<ActivityGroupResponseDTO> createGroup(
        @Valid @RequestBody ActivityGroupRequestDTO dto
    ) {
        ActivityGroupResponseDTO createdGroup = groupService.createGroup(dto);
        return new ResponseEntity<>(createdGroup, HttpStatus.CREATED);
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<ActivityGroupResponseDTO> updateGroup(
        @PathVariable Long groupId,
        @Valid @RequestBody ActivityGroupRequestDTO dto
    ) {
        ActivityGroupResponseDTO updatedGroup = groupService.updateGroup(groupId, dto);
        return ResponseEntity.ok(updatedGroup);
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long groupId) {
        groupService.deleteGroup(groupId);
        return ResponseEntity.noContent().build();
    }
}
