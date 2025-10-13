package com.ravcontrol.backend.repository;

import com.ravcontrol.backend.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    /**
     * Esse método retornará o valor total de atividades do grupo
     * @param groupId id do grupo que a atividade pertence
     * @return retorna o valor de atividades presentes no grupo
     */
    int countByGroupId(Long groupId);

    /**
     * Esse método busca atividades pelo nome, contendo letras de name e ignorando case maiúscula/minúscula
     * @param name Nome da atividade a ser buscada
     * @return Uma lista de atividades que correspondem ao critério
     */
    List<Activity> findByNameContainingIgnoreCase(String name);

    /**
     * Esse método retornará a quantidade de atividades que já passaram do prazo
     * @param today A data atual que comparará com DueDate (dueDate < today)
     * @return A quantidade de atividades em atraso
     */
    int countByDueDateBeforeAndCompletedIsFalse(LocalDate today);
}
