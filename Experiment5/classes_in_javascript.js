class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }
}

class Student extends Person {
  constructor(name, age, studentId) {
    super(name, age);
    this.studentId = studentId;
  }

  greet() {
    return `Hello, my name is ${this.name}, I am a student, and my ID is ${this.studentId}.`;
  }
}

class Teacher extends Person {
  constructor(name, age, subject) {
    super(name, age);
    this.subject = subject;
  }

  greet() {
    return `Hello, my name is ${this.name}, I am a teacher, and I teach ${this.subject}.`;
  }
}

const genericPerson = new Person('Alex', 30);
const student = new Student('Ben', 21, 'S12345');
const teacher = new Teacher('Carol', 45, 'Mathematics');

console.log("--- Demonstrating Polymorphism ---");
const people = [genericPerson, student, teacher];
people.forEach(person => {
  console.log(person.greet());
});


console.log("\n--- Verifying Object Types with instanceof ---");
console.log(`Is student a Student? ${student instanceof Student}`);
console.log(`Is student a Person? ${student instanceof Person}`);
console.log(`Is student a Teacher? ${student instanceof Teacher}`);
console.log(`Is teacher a Teacher? ${teacher instanceof Teacher}`);
console.log(`Is teacher a Person? ${teacher instanceof Person}`);
console.log(`Is genericPerson a Student? ${genericPerson instanceof Student}`);