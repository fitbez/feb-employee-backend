const router = require("express").Router();
const Employee = require("../models/employee");

//Http methods (CRUD)
//Get --> Getting or fetching or pull data from our DB
//Post --> Creating or adding data to our DB
//Put --> Updating data in our DB
//Delete --> Deleting data from our DB

//CREATE AN EMPLOYEE
router.post("/employee", async (req, res) => {
  const newEmployee = new Employee({
    name: req.body.name,
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    callOffice: req.body.callOffice,
    callMobile: req.body.callMobile,
    sms: req.body.sms,
    email: req.body.email,
  });

  //Save this data in the DB
  try {
    const savedEmployee = await newEmployee.save();
    res.status(200).json(savedEmployee);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET EMPLOYEES
router.get("/employees", async (req, res) => {
  try {
    const allEmployees = await Employee.find({});
    res.status(200).json(allEmployees);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET EMPLOYEE
router.get("/:id", async (req, res) => {
  try {
    const findEmployee = await Employee.findById(req.params.id);
    res.status(200).json(findEmployee);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELET AN EMPLOYEE
router.delete("/:id", async (req, res) => {
  try {
    await Employee.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json("The employee has been deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE AN EMPLOYEE INFORMATION
router.put("/:id", async (req, res) => {
  try {
    const query = { _id: req.params.id };
    const updatedEmployee = await Employee.findOneAndUpdate(
      query,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
