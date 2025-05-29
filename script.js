const LOGIN_USERNAME = "Tvijay";
const LOGIN_PASSWORD = "Tvijay@123";
const EMPLOYEE_KEY = "employees";
let employees = JSON.parse(localStorage.getItem(EMPLOYEE_KEY)) || [];

function login() {
  const uname = document.getElementById("username").value;
  const pwd = document.getElementById("password").value;

  if (uname === LOGIN_USERNAME && pwd === LOGIN_PASSWORD) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("app-section").style.display = "block";
  } else {
    document.getElementById("login-error").style.display = "block";
  }
}

function generateEmployeeId() {
  return "EMP" + (employees.length + 1).toString().padStart(5, "0");
}

function generateLoginId(fname, lname) {
  let base = (fname[0] + lname).toLowerCase();
  let id = base;
  let counter = 0;

  while (employees.some(e => e.loginId === id)) {
    id = base + Math.floor(100 + Math.random() * 900); // random 3-digit
    counter++;
    if (counter > 100) break;
  }

  return id;
}

function validateDOB(dobStr) {
  const dob = new Date(dobStr);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const month = today.getMonth() - dob.getMonth();

  return age > 18 || (age === 18 && month >= 0);
}

function validateFile(file) {
  if (!file) return false;
  const fileSizeKB = file.size / 1024;
  return file.type === "application/pdf" && fileSizeKB >= 10 && fileSizeKB <= 1024;
}

function addEmployee(e) {
  e.preventDefault();

  const fname = document.getElementById("firstName").value.trim();
  const mname = document.getElementById("middleName").value.trim();
  const lname = document.getElementById("lastName").value.trim();
  const dob = document.getElementById("dob").value;
  const dept = document.getElementById("department").value;
  const salary = parseFloat(document.getElementById("salary").value);
  const permAddr = document.getElementById("permAddress").value.trim();
  const currAddr = document.getElementById("currAddress").value.trim();
  const idProof = document.getElementById("idProof").files[0];

  const msgBox = document.getElementById("employee-message");

  if (!validateDOB(dob)) {
    msgBox.innerText = "Employee must be at least 18 years old.";
    msgBox.style.display = "block";
    return false;
  }

  if (!validateFile(idProof)) {
    msgBox.innerText = "Only PDF files between 10KB and 1MB are allowed.";
    msgBox.style.display = "block";
    return false;
  }

  const empId = generateEmployeeId();
  const loginId = generateLoginId(fname, lname);

  const reader = new FileReader();
  reader.onload = function () {
    const newEmp = {
      employeeId: empId,
      loginId,
      firstName: fname,
      middleName: mname,
      lastName: lname,
      dob,
      department: dept,
      salary,
      permAddress: permAddr,
      currAddress: currAddr,
      idProof: reader.result,
    };

    employees.push(newEmp);
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(employees));
    alert("Employee added successfully!");
    document.getElementById("employee-form").reset();
    msgBox.style.display = "none";
  };

  reader.readAsDataURL(idProof);
}
