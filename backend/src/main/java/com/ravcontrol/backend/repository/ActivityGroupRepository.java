package com.ravcontrol.backend.repository;

import com.ravcontrol.backend.entity.ActivityGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityGroupRepository  extends JpaRepository<ActivityGroup, Long> {

    /**
     * Esse método buscará todos os grupos no banco de dados ordenados em ordem ascendente
     * @return Retorna uma lista de grupos de atividade
     */
    List<ActivityGroup> findAllByOrderByPositionAsc();
}
