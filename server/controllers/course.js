import Course from "../models/Course.js";


export const createCourse = async (req, res, next) => {


  const newCourse = new Course(req.body);
  try {
    const savedCourse = await newCourse.save();
    res.status(200).json(savedCourse);
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body},
      { new: true }
    );
    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json("the Course has been deleted");
  } catch (err) {
    next(err);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('class', 'name')
      .populate('teacher', 'teachername');

    if (course && course.class) {
      // Transform the data before sending it in the response
      const { class: { name, ...classInfo }, ...rest } = course.toObject();
      const { teacher: {teachername, ...teacherInfo}, ...teacherrest} = course.toObject();
      const transformedCourse = { ...rest, classname: name, teacher: teachername, classInfo };

      res.status(200).json(transformedCourse);
    }
    else 
      res.status(200).json(course)
  } catch (err) {
    next(err);
  }
};

// this function fetches info without populate
export const getSingleCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .populate('class', 'name')
      .populate('teacher', 'teachername');
    const transformedCourses = courses.map(course => {
      const { class: { name, ...classInfo }, ...rest } = course.toObject();
      const {teacher: {teachername, ...teacherInfo}, ...teacherrest} = course.toObject();

      if(course.teacher)
        return { ...rest, classname: name, teachername: teachername, classInfo };
      else 
        return {...rest, classname: name, classInfo};
      
    });
    res.status(200).json(transformedCourses);
  } catch (err) {
    next(err)
  }
}
