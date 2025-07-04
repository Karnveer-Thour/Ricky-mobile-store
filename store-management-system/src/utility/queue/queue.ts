class Node<T> {
  data: T;
  next: Node<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

export default class Queue<T> {
  private front: Node<T> | null;
  private rear: Node<T> | null;

  constructor() {
    this.front = this.rear = null;
  }

  isEmpty(): boolean {
    return this.front === null && this.rear === null;
  }

  enQueue(newData: T): void {
    const newNode = new Node<T>(newData);
    if (this.isEmpty()) {
      this.front = this.rear = newNode;
      return;
    }
    if (this.rear) {
      this.rear.next = newNode;
      this.rear = newNode;
    }
  }

  deQueue(): T | undefined {
    if (this.isEmpty() || this.front === null) {
      return;
    }

    const temp = this.front;
    this.front = this.front.next;

    if (this.front === null) {
      this.rear = null;
    }

    return temp.data;
  }

  peek(): T | undefined {
    if (this.isEmpty() || this.front === null) {
      return;
    }
    return this.front.data;
  }

  traverseQueue(): void {
    if (this.isEmpty()) {
      console.log("Queue is empty!");
      return;
    }

    let temp = this.front;
    let queueString = "Queue elements are:";
    while (temp !== null) {
      queueString += ` ${temp.data}`;
      temp = temp.next;
    }
    console.log(queueString);
  }
}
