package com.ravcontrol.backend.repository;

import com.ravcontrol.backend.entity.ActivityGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityGroupRepository  extends JpaRepository<ActivityGroup, Long> {}
