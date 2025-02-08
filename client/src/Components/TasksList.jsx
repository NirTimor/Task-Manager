import React from "react";
import { Card, Button, ListGroup } from "react-bootstrap";

const TasksList = ({ tasks, onDelete, onComplete }) => (
  <div className="mt-4">
    {tasks.length > 0 ? (
      <ListGroup className="task-list">
        {tasks.map((task) => (
          <Card key={task.id} className="mb-3 shadow-sm">
            <Card.Body className={`text-center ${task.is_completed ? 'bg-light' : ''}`}>
              <Card.Title className="task-title">{task.title}</Card.Title>
              <Card.Text>{task.description}</Card.Text>
              <p>
                Priority:{" "}
                <span
                  style={{
                    color:
                      task.priority === "Low"
                        ? "lightgreen"
                        : task.priority === "Medium"
                          ? "black"
                          : "lightcoral",
                    fontWeight: "bold",
                  }}
                >
                  {task.priority}
                </span>
              </p>
              <p>Status: {task.is_completed ? "Completed" : "Incomplete"}</p>
              <div className="d-flex justify-content-center gap-2 mt-3">
                {!task.is_completed && (
                  <Button variant="success" onClick={() => onComplete(task.id)}>
                    Mark as Complete
                  </Button>
                )}
                <Button variant="danger" onClick={() => onDelete(task.id)}>
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>

        ))}
      </ListGroup>
    ) : (
      <p className="text-muted">No tasks available. Add a new task to get started!</p>
    )}
  </div>
);

export default TasksList;
