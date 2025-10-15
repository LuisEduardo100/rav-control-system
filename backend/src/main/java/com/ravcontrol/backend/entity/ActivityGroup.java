package com.ravcontrol.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "activity_group")
public class ActivityGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer position = 0;

    @Column(
        name = "created_at",
        nullable = false,
        updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(
        mappedBy = "group",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY
    )
    private List<Activity> activities = new ArrayList<>();

    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public void addActivity(Activity activity, int position) {
        int insertPosition = Math.min(position, this.activities.size());
        this.activities.add(insertPosition, activity);
        activity.setGroup(this);
        activity.setPosition(insertPosition);
    }

    public void removeActivity(Activity activity) {
        this.activities.remove(activity);
    }
}
