import React from "react";
import Todo from "./todo";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      severity: "low",
      todos: [],
      searchQuery: "",
      selectedSeverities: [],
      errorMessage: "",
      showOnlyUncompleted: false,
      showDeleteConfirmation: false,
    };
  }

  generateTasks = () => {
    const newTodos = [];
    const now = new Date().toLocaleString();
    for (let i = 0; i < 1000; i++) {
      newTodos.push({
        name: `Task ${i + 1}`,
        description: `Description for task ${i + 1}`,
        severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        checked: false,
        createdAt: now,
      });
    }
    this.setState({ todos: [...newTodos, ...this.state.todos] });
  };

  handleInputChange = (e) => {
    this.setState({ title: e.target.value, errorMessage: "" });
  };

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value });
  };

  handleSeverityChange = (e) => {
    this.setState({ severity: e.target.value });
  };

  handleTodoAdd = () => {
    const trimmedTitle = this.state.title.trim();
    const trimmedDescription = this.state.description.trim();

    if (trimmedTitle === "" || trimmedDescription === "") {
      this.setState({
        errorMessage: "Please enter the title and description.",
      });
      return;
    }

    const now = new Date().toLocaleString();

    this.setState({
      title: "",
      description: "",
      todos: [
        {
          name: trimmedTitle,
          description: trimmedDescription,
          severity: this.state.severity,
          checked: false,
          createdAt: now,
        },
        ...this.state.todos,
      ],
      errorMessage: "",
    });
  };

  handleTodoChecked = (index) => (e) => {
    const checked = e.target.checked;
    const newTodo = { ...this.state.todos[index], checked };

    this.setState({
      todos: this.state.todos
        .map((todo, i) => (i === index ? newTodo : todo))
        .sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1)),
    });
  };

  handleTodoDelete = (index) => () => {
    this.setState({
      todos: this.state.todos.filter((_, i) => i !== index),
    });
  };

  handleTodoEdit = (index) => (newTitle, newDescription) => {
    const newTodo = {
      ...this.state.todos[index],
      name: newTitle,
      description: newDescription,
    };

    this.setState({
      todos: this.state.todos.map((todo, i) => (i === index ? newTodo : todo)),
    });
  };

  handleMoveUp = (index) => () => {
    if (index === 0) return;

    const todos = [...this.state.todos];
    const [movedTodo] = todos.splice(index, 1);
    todos.splice(index - 1, 0, movedTodo);

    this.setState({ todos });
  };

  handleMoveDown = (index) => () => {
    if (index === this.state.todos.length - 1) return;

    const todos = [...this.state.todos];
    const [movedTodo] = todos.splice(index, 1);
    todos.splice(index + 1, 0, movedTodo);

    this.setState({ todos });
  };

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleSeverityFilterChange = (severity) => {
    this.setState((prevState) => {
      const selectedSeverities = [...prevState.selectedSeverities];
      if (selectedSeverities.includes(severity)) {
        return {
          selectedSeverities: selectedSeverities.filter((s) => s !== severity),
        };
      } else {
        return { selectedSeverities: [...selectedSeverities, severity] };
      }
    });
  };

  handleDeleteAll = () => {
    this.setState({ showDeleteConfirmation: true });
  };

  confirmDeleteAll = () => {
    this.setState({ todos: [], showDeleteConfirmation: false });
  };

  handleDeleteCompleted = () => {
    this.setState({
      todos: this.state.todos.filter((todo) => !todo.checked),
    });
  };

  render() {
    const filteredTodos = this.state.todos
      .filter(
        (todo) =>
          this.state.searchQuery === "" ||
          todo.name
            .toLowerCase()
            .includes(this.state.searchQuery.toLowerCase()) ||
          todo.description
            .toLowerCase()
            .includes(this.state.searchQuery.toLowerCase())
      )
      .filter(
        (todo) =>
          this.state.selectedSeverities.length === 0 ||
          this.state.selectedSeverities.includes(todo.severity)
      )
      .filter((todo) =>
        this.state.showOnlyUncompleted ? !todo.checked : true
      );

    const isFilterActive =
      this.state.searchQuery ||
      this.state.selectedSeverities.length > 0 ||
      this.state.showOnlyUncompleted;

    return (
      <div className="container">
        <div>
          <input
            value={this.state.title}
            onChange={this.handleInputChange}
            placeholder="Task Title"
          />
          <input
            value={this.state.description}
            onChange={this.handleDescriptionChange}
            placeholder="Task Description"
          />
          <select
            style={{
              padding: "10px",
              border: "1px solid #282828",
              fontSize: "14px",
              color: "#282828",
              backgroundColor: "#f5f5f5",
              cursor: "pointer",
              outline: "none",
              fontFamily: "Montserrat, sans-serif",
            }}
            value={this.state.severity}
            onChange={this.handleSeverityChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div
            className="button-container"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // Центрирование элементов по горизонтали
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={this.handleTodoAdd}>Add</button>
              <button onClick={this.generateTasks}>Generate 1000 Tasks</button>
              {this.state.todos.length > 0 && (
                <>
                  <button
                    onClick={() =>
                      this.setState({
                        showOnlyUncompleted: !this.state.showOnlyUncompleted,
                      })
                    }
                  >
                    {this.state.showOnlyUncompleted
                      ? "Show All"
                      : "Show Only Uncompleted"}
                  </button>
                  <button className="deleteall" onClick={this.handleDeleteAll}>
                    Delete All
                  </button>
                  <button
                    className="deletecompleted"
                    onClick={this.handleDeleteCompleted}
                  >
                    Delete Completed
                  </button>
                </>
              )}
            </div>

            {/* Перемещение модального окна под кнопки */}
            {this.state.showDeleteConfirmation && (
              <div className="delete-confirmation-modal">
                <p>Are you sure you want to delete all tasks?</p>
                <button onClick={this.confirmDeleteAll}>Yes</button>
                <button
                  onClick={() =>
                    this.setState({ showDeleteConfirmation: false })
                  }
                >
                  No
                </button>
              </div>
            )}
          </div>

          {this.state.errorMessage && (
            <p style={{ color: "red" }}>{this.state.errorMessage}</p>
          )}
        </div>

        {this.state.todos.length > 0 && (
          <div>
            <input
              value={this.state.searchQuery}
              onChange={this.handleSearchChange}
              placeholder="Search Tasks"
            />
            <div>
              <label
                className={`newlabel ${
                  this.state.selectedSeverities.includes("low") ? "clicked" : ""
                }`}
                onClick={() => this.handleSeverityFilterChange("low")}
              >
                Low
              </label>
              <label
                className={`newlabel ${
                  this.state.selectedSeverities.includes("medium")
                    ? "clicked"
                    : ""
                }`}
                onClick={() => this.handleSeverityFilterChange("medium")}
              >
                Medium
              </label>
              <label
                className={`newlabel ${
                  this.state.selectedSeverities.includes("high")
                    ? "clicked"
                    : ""
                }`}
                onClick={() => this.handleSeverityFilterChange("high")}
              >
                High
              </label>
            </div>
            {filteredTodos.length === 0 ? (
              <p>
                {isFilterActive
                  ? "No tasks match the filters."
                  : "No tasks yet."}
              </p>
            ) : (
              <ul>
                {filteredTodos.map((todo, i) => (
                  <Todo
                    key={i}
                    name={todo.name}
                    description={todo.description}
                    severity={todo.severity}
                    createdAt={todo.createdAt}
                    checked={todo.checked}
                    onCheck={this.handleTodoChecked(i)}
                    onDelete={this.handleTodoDelete(i)}
                    onEdit={this.handleTodoEdit(i)}
                    onMoveUp={this.handleMoveUp(i)}
                    onMoveDown={this.handleMoveDown(i)}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }
}
