const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
app.use(express.json());

async function fetchStudentData(studentId) {
  try {
    const response = await axios.get(
      `${process.env.API_BASE_URL}/${studentId}`
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      "Unable to fetch student data. Please try again later.",
      error.message
    );
  }
}

app.all("/whatsapp-webhook", async (req, res) => {
  const userMessage = req.body.Body;

  // Check if the user provided any input
  if (!userMessage || userMessage.trim() === "") {
    return res.send(
      "Error: Please provide a studentId. You can enter the studentId as a message."
    );
  }

  // Assuming the user provides the studentId in the message
  const studentId = userMessage;

  try {
    if (isNaN(studentId)) {
      throw new Error("Invalid studentId. Please provide a valid studentId.");
    }

    const studentData = await fetchStudentData(studentId);

    // Assuming studentData is an object with student details
    const responseMessage = `Student ID: ${studentData.studentId}\nName: ${studentData.studentName}\nEmail: ${studentData.studentEmail}\n`;
    // Respond to the user with the student data
    res.send(responseMessage);
  } catch (error) {
    // Handle any errors and respond to the user with an error message
    res.send(`Error: ${error.message}`);
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
