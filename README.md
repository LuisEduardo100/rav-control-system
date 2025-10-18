# RAV Control System - Quadro de Atividades

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Oracle](https://img.shields.io/badge/Oracle-21c_XE-F80000?style=for-the-badge&logo=oracle&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)

![Demonstração Drag-and-Drop](./.github/assets/gif-kanban.gif)

---

## 📋 Sumário

1.  [Apresentação do Projeto](#apresentação-do-projeto)
2.  [Tecnologias Utilizadas](#tecnologias-utilizadas)
3.  [Configuração e Instalação](#configuração-e-instalação)
    - [Backend (Java / Spring Boot)](#backend-java--spring-boot)
    - [Frontend (React / Vite)](#frontend-react--vite)
4.  [Testando a API](#testando-a-api)
5.  [Autor](#autor)

---

## Apresentação do Projeto

O Quadro de Atividades é uma aplicação Full Stack que simula um ambiente de gerenciamento de tarefas. A interface permite a criação dinâmica de grupos (colunas) e atividades (cards), incluíndo editar e deletar grupos e atividades dinamicamente. Marcar atividades como concluído, pesquisar por atividades em grupos e saber quais e quantas atividades estão em atraso de maneira rápida. Abaixo segue registros das princiapis funcionalidades.

**Funcionalidades Principais:**

<details>
  <summary><strong>Visão Geral e Gerenciamento de Grupos</strong></summary>
  <br>
  <em>Visão completa do quadro Kanban e o processo de criação de um novo grupo.</em>
  <br><br>
  <img src="./.github/assets/kanban-board.png" alt="Visão Geral do Quadro Kanban" width="750">
  <img src="./.github/assets/kanban-board-add-group.png" alt="Adicionando um novo grupo" width="750">
</details>

<details>
  <summary><strong>Gerenciamento de Atividades (CRUD)</strong></summary>
  <br>
  <em>Telas para criação e edição de atividades, com validação de formulário e campos para data de entrega e status de conclusão.</em>
  <br><br>
  <img src="./.github/assets/new-activity.png" alt="Modal de Adicionar Atividade" width="600">
  <img src="./.github/assets/edit-activity.png" alt="Modal de Edição de Atividade" width="600">
</details>

<details>
  <summary><strong>Busca e Notificações de Atraso</strong></summary>
  <br>
  <em>Funcionalidades de busca em tempo real e um sistema de notificação para atividades atrasadas, que também funciona como um filtro interativo.</em>
  <br><br>
  <img src="./.github/assets/search-activities.png" alt="Busca e Notificação" width="750">
  <img src="./.github/assets/overdue-activity-notification.png" alt="Tooltip da Notificação" width="500">
  <img src="./.github/assets/overdue-activity-filtered.png" alt="Filtro de Atividades Atrasadas Ativo" width="750">
</details>

<details>
  <summary><strong> Ações e Feedback ao Usuário (Toasts)</strong></summary>
  <br>
  <em>Sistema de notificação customizado para confirmação de ações destrutivas (exclusão) e feedback de sucesso para operações de CRUD.</em>
  <br><br>
  <img src="./.github/assets/kanban-board-creating-group.png" alt="Grupo sendo criado" width="750">
  <img src="./.github/assets/toast-grupo-criado.png" alt="Aviso de sucesso após grupo ser criado" width="500">
  <img src="./.github/assets/toast-grupo-deletado.png" alt="Aviso após grupo ser deletado" width="500">
  <img src="./.github/assets/toast-atividade-atualizada.png" alt="Aviso após atividade ser atualizada" width="500">
  <img src="./.github/assets/delete-group.png" alt="Confirmação para Excluir Grupo" width="500">
  <img src="./.github/assets/delete-activity.png" alt="Confirmação para Excluir Atividade" width="500">
</details>

---

## Tecnologias Utilizadas

A aplicação foi construída utilizando um ecossistema moderno e robusto, tanto no backend quanto no frontend.

- **Backend**:

  - Java 17
  - Spring Boot 3
  - Spring Data JPA / Hibernate
  - Maven
  - Oracle Database 21c XE

- **Frontend**:
  - React 19 com Vite
  - TypeScript
  - Zustand (para gerenciamento de estado)
  - React Hook Form + Zod (para formulários e validação)
  - Dnd-Kit (para drag-and-drop)
  - Axios (para comunicação com a API)
  - TailwindCSS (para estilização)
  - Lucide React (para iconografia)
  - React Router DOM

---

## Configuração e Instalação

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### Backend (Java / Spring Boot)

**1. Pré-requisitos:**

- JDK 17 ou superior.
- Maven 3.x.
- Uma instância do Oracle Database 21c XE rodando localmente ou em rede.

**2. Banco de Dados (Oracle):**
Primeiro, crie um banco de dados no Oracle Developer e conecte-o com nossa aplicação. Ao passar as credenciais corretamente, só rodar o projeto fará criar as tabelas (activity_group e activities) no banco de dados.

**3. Configuração da Aplicação:**
O projeto utiliza perfis do Spring para gerenciar as configurações. O arquivo principal é o `application.properties`.

`src/main/resources/application.properties`:

```properties
spring.application.name=rav-control-backend
spring.profiles.active=local
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.OracleDialect
server.port=8080
```

Crie o arquivo `application-local.properties` na mesma pasta para suas credenciais locais (este arquivo é ignorado pelo Git).

`src/main/resources/application-local.properties`:

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:XE
spring.datasource.username=SEU_USUARIO_ORACLE
spring.datasource.password=SUA_SENHA_ORACLE
```

**4. Rodando o Backend:**
Dependendo da sua IDE você pode ir até o RavControlBackendApplication e rodar apertando o botão com ícone de play. Mas também você pode ir até a pasta raiz do projeto backend e execute o seguinte comando no seu terminal:

```bash
mvn spring-boot:run
```

O servidor estará rodando em `http://localhost:8080`, assim como foi definido no application.properties.

### Frontend (React / Vite)

**1. Pré-requisitos:**

- Node.js (versão 18.x ou superior recomendada).
- NPM ou Yarn.

**2. Clonando o Repositório:**

```bash
git clone [https://github.com/LuisEduardo100/rav-control-system.git](https://github.com/LuisEduardo100/rav-control-system.git)
```

**3. Instalação das Dependências:**
Dentro da pasta rav-control-system, navegue até a pasta do frontend e instale os pacotes necessários.

```bash
cd frontend
npm install
```

**4. Configuração de Ambiente:**
Crie um arquivo `.env` na raiz da pasta do projeto e adicione a URL base da sua API backend.

```env
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

**5. Rodando o Frontend:**
Execute o seguinte comando para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará acessível em `http://localhost:5173` (ou outra porta indicada no terminal).

---

## Testando a API

Com o backend rodando, você pode usar uma ferramenta como Postman ou Insomnia para testar os endpoints.

- **Listar todos os grupos e atividades**

  - **GET** `http://localhost:8080/api/groups`
  - **Resposta Esperada (Exemplo):**
    ```json
    [
      {
        "id": 1,
        "name": "Planejamento",
        "position": 0,
        "activities": [
          {
            "id": 5,
            "name": "Definir requisitos",
            "description": "Detalhar as funcionalidades do projeto.",
            "dueDate": "2025-10-20",
            "completed": false,
            "position": 0
          }
        ]
      }
    ]
    ```

- **Criar uma nova atividade**
  - **POST** `http://localhost:8080/api/activities`
  - **Corpo da Requisição (JSON):**
    ```json
    {
      "name": "Desenvolver componente de Header",
      "groupId": 1
    }
    ```

---

## Autor

Desenvolvido por **Luís Eduardo**.

- **LinkedIn**: [[Luís Eduardo de Paula Albuquerque](https://www.linkedin.com/in/luis-eduardo-de-paula-albuquerque/)]
- **GitHub**: [@LuisEduardo100](https://github.com/LuisEduardo100)
