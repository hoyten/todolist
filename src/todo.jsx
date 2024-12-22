import React from "react";

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      editTitle: this.props.name,
      editDescription: this.props.description,
    };
  }

  handleEditClick = () => {
    this.setState({ isEditing: true });
  };

  handleEditTitleChange = (e) => {
    this.setState({ editTitle: e.target.value });
  };

  handleEditDescriptionChange = (e) => {
    this.setState({ editDescription: e.target.value });
  };

  handleSaveClick = () => {
    this.props.onEdit(this.state.editTitle, this.state.editDescription);
    this.setState({ isEditing: false });
  };

  handleCancelClick = () => {
    this.setState({
      isEditing: false,
      editTitle: this.props.name,
      editDescription: this.props.description,
    });
  };

  render() {
    return (
      <li className="todo-item">
        <input
          type="checkbox"
          id={`todo-${this.props.name}`}
          checked={this.props.checked}
          onChange={this.props.onCheck}
        />
        <label htmlFor={`todo-${this.props.name}`}>
          <span className="todo-text">
            <span className={this.props.checked ? "completed" : ""}>
              {this.state.isEditing ? (
                <>
                  <input
                    value={this.state.editTitle}
                    onChange={this.handleEditTitleChange}
                    placeholder="Edit Task Title"
                  />
                  <input
                    value={this.state.editDescription}
                    onChange={this.handleEditDescriptionChange}
                    placeholder="Edit Task Description"
                  />
                  <button onClick={this.handleSaveClick}>Save</button>
                  <button onClick={this.handleCancelClick}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>{this.props.name}</strong>
                  <p>{this.props.description}</p>
                  <span className="todo-severity">
                    Importance: {this.props.severity}
                  </span>
                  <span className="todo-time">
                    <em>{this.props.createdAt}</em>
                  </span>
                </>
              )}
            </span>
          </span>
        </label>
        {!this.state.isEditing && (
          <button onClick={this.handleEditClick}>Edit</button>
        )}
        <button onClick={this.props.onDelete}>Delete</button>
        <button onClick={this.props.onMoveUp}>↑</button>
        <button onClick={this.props.onMoveDown}>↓</button>
      </li>
    );
  }
}

export default Todo;
