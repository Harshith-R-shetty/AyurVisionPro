// import { useState, useEffect } from "react";
// import axios from "axios";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// const MyForm = () => {
//   const [formData, setFormData] = useState({});
//   const [questions, setQuestions] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submissionMessage, setSubmissionMessage] = useState("");
//   const [apiResponse, setApiResponse] = useState(null); // Add this line

//   useEffect(() => {
//     const data = {
//       Gender: ["Female", "Male"],
//       bodyFrame_Breadth: ["Broad", "Medium", "Thin/Narrow"],
//       skin_Nature: ["Dry", "Normal", "Oily", "Seasonal/Variable"],
//       skin_Color: [
//         "Dark",
//         "FairPaleYellow",
//         "FairPink",
//         "FairReddish",
//         "Whitish",
//       ],
//       weight_Changes: [
//         "Difficultyingaining",
//         "Gainandloseeasily",
//         "Gaineasilyandlosewithdifficulty",
//         "Stable",
//       ],
//       nails_color: ["PaleYellow", "Pink", "Reddish"],
//       teeth_Color: ["Dull/Blackish", "MilkyWhite", "Yellowish"],
//       teeth_Shape: ["Irregular", "Regular"],
//       recalling_speed: ["Moderately", "Quickly", "Slowly", "Variably"],
//       memorizing_speed: ["Moderately", "Quickly", "Slowly", "Variably"],
//       sleep_Amount: ["High", "Low", "Medium", "Variable"],
//       sleep_Quality: ["Deep", "Shallow", "Sound"],
//       speaking_Amount: ["Excessive", "Less", "Moderate"],
//       speaking_Speed: ["Medium", "Quick", "Slow", "Variable"],
//       walking_Speed: ["Medium", "Quick/Fast/Brisk", "Slow", "Variable"],
//       bowel_Freq: ["Irregular", "Regular", "Variable"],
//       retainingFriends_quality: ["Good", "Medium", "Poor"],
//       dreams_Amount: ["High", "Low", "Medium", "Variable"],
//       voice_clear: ["Clear", "Non_Clear"],
//       eye_Color: ["Black", "DarkBrown", "Grayish", "LightBrown"],
//       healthproblem_in_temp: ["Both", "Cold", "Warm", null],
//       hair_Growth: ["Dense", "Moderate", "Scanty"],
//       hair_Type: ["Thick", "Thin"],
//       hair_Nature2: ["Falling", "Non_Falling"],
//       appetite_Amount: ["High", "Low", "Medium", "Variable"],
//       appetite_Frequency: ["Irregular", "Regular"],
//       bladder_Frequency: ["Irregular", "Regular"],
//       perspiration_Amount: ["High", "Low", "Medium"],
//       stool_Consistency: ["Hard", "Loose/Soft/Semisolid", "Medium"],
//       mental_Power: ["Grade1", "Grade2", "Grade3"],
//       physical_Power: ["Grade1", "Grade2", "Grade3"],
//       Anger_Freq: ["Good", "Medium", "Poor"],
//       Irritability_speed: ["Moderately", "Quickly", "Slowly", "Variably"],
//       speech_Argumentative: ["Argumentative", "Non_Argumentative"],
//     };

//     const questionsArray = Object.entries(data).map(([key, options]) => ({
//       key,
//       label: key.replace(/_/g, " "),
//       options,
//     }));

//     setQuestions(questionsArray);
//     const initialFormData = {};
//     questionsArray.forEach((question) => {
//       initialFormData[question.key] = "";
//     });
//     setFormData(initialFormData);
//   }, []);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setIsSubmitting(true);

//     const dataArray = [];
//     for (const key in formData) {
//       dataArray.push(parseInt(formData[key], 10));
//     }

//     axios
//       .post("http://localhost:3000/predict", { data: dataArray })
//       .then(async (response) => {
//         console.log(response.data);
//         setApiResponse(response.data);
//         setSubmissionMessage(`Successfully submitted.`);
//         await axios.get(`http://localhost:3000/chatbot/?msg=${response.data}`);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       })
//       .finally(() => {
//         setIsSubmitting(false);
//       });

//     setIsSubmitting(false);
//     setFormData({});
//   };

//   return (
//     <>
//       <div style={{ marginTop: "70px" }}>
//         <Navbar />
//       </div>

//       <div className="min-h-screen bg-green-100">
//         <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold mb-8">Prakriti Identification</h1>
//           <div className="w-full max-w-3xl bg-white p-8 rounded shadow-md">
//             <form onSubmit={handleSubmit} className="w-full">
//               {questions.map((question, index) => (
//                 <div key={index} className="mb-6">
//                   <h3 className="text-lg font-semibold mb-2">
//                     {question.label}
//                   </h3>
//                   <div className="flex flex-col">
//                     {question.options.map((option, optionIndex) => (
//                       <label
//                         key={optionIndex}
//                         className="flex items-center mb-2"
//                       >
//                         <input
//                           type="radio"
//                           name={question.key}
//                           value={optionIndex}
//                           checked={
//                             formData[question.key] === optionIndex.toString()
//                           }
//                           onChange={handleChange}
//                           className="form-radio text-indigo-600"
//                         />
//                         <span className="ml-2">{option}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//               <button
//                 type="submit"
//                 className={`w-full py-2 px-4 rounded ${
//                   isSubmitting
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-indigo-600 text-white hover:bg-green-500 transition duration-200"
//                 }`}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Submitting..." : "Submit"}
//               </button>
//               {submissionMessage && (
//                 <p className="text-center mt-4">{submissionMessage}</p>
//               )}
//               {apiResponse && (
//                 <div className="text-center mt-4">
//                   <p>Your Prakriti:</p>
//                   <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
//                 </div>
//               )}
//             </form>
//           </div>
//         </div>
//       </div>
//       <div>
//         <Footer />
//       </div>
//     </>
//   );
// };

// export default MyForm;
import React from "react";
import { useState, useEffect } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BarChart } from "./BarChart";

// require("dotenv").config();
const Prakriti = () => {
  const [formData, setFormData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [labeledPercentages, setLabeledPercentages] = useState({});
  const [dominantVikrithi, setDominantVikrithi] = useState("");

  const mappings = {
    2: [2, 1, 0],
    3: [0, 1, 2, 1],
    5: [0, 1, 2, 1],
    6: [0, 2, 1],
    7: [0, 2, 1],
    11: [2, 0, 1],
    14: [1, 0, 2],
    15: [1, 0, 2],
    17: [2, 1, 0],
    21: [2, 0, 1],
    25: [1, 2, 0],
    29: [0, 1, 2],
    30: [2, 0, 1],
    32: [2, 0, 1],
  };

  const doshaMap = {
    0: "Vata",
    1: "Pitta",
    2: "Kapha",
  };

  let maxKey = 0;

  useEffect(() => {
    // const data = {
    //   "1.What is your gender?": ["Female", "Male"],
    //   "2.How is your body frame?": ["Broad", "Medium", "Thin/Narrow"],
    //   "3.What is the nature of your skin?": [
    //     "Dry",
    //     "Normal",
    //     "Oily",
    //     "Seasonal/Variable",
    //   ],
    //   "4.What is the colour of your skin?": [
    //     "Dark",
    //     "Fair, Pale, Yellowish",
    //     "Fair, Pink",
    //     "Fair, Reddish",
    //     "Whitish",
    //   ],
    //   "5.How often does your weight change?": [
    //     "Difficulty in gaining",
    //     "Gain and lose easily",
    //     "Gain easily and lose with difficulty",
    //     "Stable",
    //   ],
    //   "6.What is the colour of your nails?": ["Pale Yellow", "Pink", "Reddish"],
    //   "7.What is the colour of your teeth?": [
    //     "Dull/Blackish",
    //     "Milky White",
    //     "Yellowish",
    //   ],
    //   "8.What is the shape of your teeth": ["Irregular", "Regular"],
    //   "9.How fast can you recall past memories?": [
    //     "Moderately",
    //     "Quickly",
    //     "Slowly",
    //   ],
    //   "10.How fast can you memorize new concepts?": [
    //     "Moderately",
    //     "Quickly",
    //     "Slowly",
    //   ],
    //   "11.How much sleep do you get on average?": ["High", "Low", "Medium"],
    //   "12.How well do you sleep once you fall asleep?": [
    //     "Deep sleep",
    //     "Shallow sleep",
    //     "Not deep but sound sleep",
    //   ],
    //   "13.How much do you speak on average?": ["Excessive", "Less", "Moderate"],
    //   "14.How fast do you speak?": ["Medium", "Quick", "Slow"],
    //   "15.How fast do you walk?": ["Medium", "Quick", "Slow"],
    //   "16.How frequently do you pass bowels?": ["Irregular", "Regular"],
    //   "17.What is the status of old friendships?": ["Good", "Medium", "Poor"],
    //   "18.How often do you dream in your sleep?": ["High", "Low", "Medium"],
    //   "19.Is your voice and speaking clear?": ["Yes, clear", "No, not clear"],
    //   "20.What is the colour of your eyes?": [
    //     "Black",
    //     "Dark Brown",
    //     "Greyish",
    //     "Light Brown",
    //   ],
    //   "21.What kind of weather would you avoid?": ["Both", "Cold", "Warm"],
    //   "22.How would you describe your hair?": ["Dense", "Moderate", "Scanty"],
    //   "23.Is you hair thick or thin?": ["Thick", "Thin"],
    //   "24.Do you suffer from hair fall?": ["Yes, hair falling", "No hair fall"],
    //   "25.What kind of appetite do you have?": ["High", "Low", "Medium"],
    //   "26.What is the regularity of your food consumption?": [
    //     "Irregular",
    //     "Regular",
    //   ],
    //   "27.How frequently do you usually need to go to the bathroom?": [
    //     "Irregular",
    //     "Regular",
    //   ],
    //   "28.How much do you sweat?": ["High", "Low", "Medium"],
    //   "29.What is the consistency of your stool?": [
    //     "Hard",
    //     "Semisolid",
    //     "Medium",
    //   ],
    //   "30.What would you rate your mental strength?": ["Good", "Okay", "Bad"],
    //   "31.What would you rate your physical strength?": ["Good", "Okay", "Bad"],
    //   "32.How is your anger tolerance": ["Good", "Medium", "Poor"],
    //   "33.How often do you get angry?": ["Moderately", "Very often", "Rarely"],
    //   "34.Are you an argumentative person?": [
    //     "Argumentative",
    //     "Non Argumentative",
    //   ],
    // };

    const data = {
      "1.What is your gender?": ["Female", "Male"],
      "2.How is your body frame?": ["Broad", "Medium", "Thin/Narrow"],
      "3.What is the nature of your skin?": [
        "Dry",
        "Normal",
        "Oily",
        "Seasonal/Variable",
      ],
      "4.What is the colour of your skin?": [
        "Dark",
        "Fair, Pale, Yellowish",
        "Fair, Pink",
        "Fair, Reddish",
        "Whitish",
      ],
      "5.How often does your weight change?": [
        "Difficulty in gaining",
        "Gain and lose easily",
        "Gain easily and lose with difficulty",
        "Stable",
      ],
      "6.What is the colour of your nails?": ["Pale Yellow", "Pink", "Reddish"],
      "7.What is the colour of your teeth?": [
        "Dull/Blackish",
        "Milky White",
        "Yellowish",
      ],
      "8.What is the shape of your teeth": ["Irregular", "Regular"],
      "9.How fast can you recall past memories?": [
        "Moderately",
        "Quickly",
        "Slowly",
      ],
      "10.How fast can you memorize new concepts?": [
        "Moderately",
        "Quickly",
        "Slowly",
      ],
      "11.How much sleep do you get on average?": ["High", "Low", "Medium"],
      "12.How well do you sleep once you fall asleep?": [
        "Deep sleep",
        "Shallow sleep",
        "Not deep but sound sleep",
      ],
      "13.How much do you speak on average?": ["Excessive", "Less", "Moderate"],
      "14.How fast do you speak?": ["Medium", "Quick", "Slow"],
      "15.How fast do you walk?": ["Medium", "Quick", "Slow"],
      "16.How frequently do you pass bowels?": ["Irregular", "Regular"],
      "17.What is the status of old friendships?": ["Good", "Medium", "Poor"],
      "18.How often do you dream in your sleep?": ["High", "Low", "Medium"],
      "19.Is your voice and speaking clear?": ["Yes, clear", "No, not clear"],
      "20.What is the colour of your eyes?": [
        "Black",
        "Dark Brown",
        "Greyish",
        "Light Brown",
      ],
      "21.What kind of weather would you avoid?": ["Both", "Cold", "Warm"],
      "22.How would you describe your hair?": ["Dense", "Moderate", "Scanty"],
      "23.Is you hair thick or thin?": ["Thick", "Thin"],
      "24.Do you suffer from hair fall?": ["Yes, hair falling", "No hair fall"],
      "25.What kind of appetite do you have?": ["High", "Low", "Medium"],
      "26.What is the regularity of your food consumption?": [
        "Irregular",
        "Regular",
      ],
      "27.How frequently do you usually need to go to the bathroom?": [
        "Irregular",
        "Regular",
      ],
      "28.How much do you sweat?": ["High", "Low", "Medium"],
      "29.What is the consistency of your stool?": [
        "Hard",
        "Semisolid",
        "Medium",
      ],
      "30.What would you rate your mental strength?": ["Good", "Okay", "Bad"],
      "31.What would you rate your physical strength?": ["Good", "Okay", "Bad"],
      "32.How is your anger tolerance": ["Good", "Medium", "Poor"],
      "33.How often do you get angry?": ["Moderately", "Very often", "Rarely"],
      "34.Are you an argumentative person?": [
        "Argumentative",
        "Non Argumentative",
      ],

      // Appended Questions
      "35.Type of Hair": [
        "Dry and with Splits End",
        "Normal,Thin,More Hair Fall",
        "Greasy, Heavy",
      ],
      "36.Color of Hair": ["Pale Brown", "Red or Brown", "Jet Black"],
      "37.Complexion": ["Dark, Blackish", "Pink to Red", "Glowing, White"],
      "38.Pace of Performing Work": [
        "Fast, Always in Hurry",
        "Medium, Energetic",
        "Slow, Steady",
      ],
      "39.Memory": ["Short Term Bad", "Good Memory", "Long Term is Best"],
      "40.Grasping power": [
        "Grasps Quickly but not Completely and Forgets Quickly",
        "Grasps Quickly but Completely and have Good Memory",
        "Grasps Late and Retains for Longer Time",
      ],
      "41.Mood": [
        "Changes Quickly have Frequent Mood Swings",
        "Changes Slowly",
        "Stable Constant",
      ],
      "42.Eating Habit": [
        "Eats Quickly Without Chewing Properly",
        "Eats at a Moderate Speed",
        "Chews Food Properly",
      ],
      "43.Body Temperature": [
        "Less than Normal, Hands and Feets are Cold",
        "More than Normal, Face and Forehead Hot",
        "Normal, Hands and Feets Slightly Cold",
      ],
      "44.Joints": [
        "Weak, Noise on Movement",
        "Healthy with Optimal Strength",
        "Heavy Weight Bearing",
      ],
      "45.Nature": [
        "Timid, Jealous",
        "Egoistic, Fearless",
        "Forgiving, Greatful , Not Greedy",
      ],
      "46.Body Energy": [
        "Becomes Low in Evening, Fatigues After Less Work",
        "Moderate , Gets Tired After Medium Work",
        "Excellent Energy Throughout Day Not Easily Fatigued",
      ],
      "47.Eyeball": ["Unsteady, Fast Moving", "Moving Slowly", "Steady"],
      "48.Quality of Voice": [
        "Rough with Broken Words",
        "Fast, Commanding",
        "Soft and Deep",
      ],
      "49.Dreams": [
        "Sky, Wind, Flying , Objects and Confusion",
        "Fire,Light,Bright Colors, Violence",
        "Water Pools, Gardens and Good Relationships",
      ],
      "50.Wealth": [
        "Spends Without Thinking Much",
        "Saves but Spends on Valuable Things",
        "Prefers More Savings",
      ],
    };

    //prakriti -->  1,4,8,9,10,12,13,16,18,19,20,22,23,24,26,27,28,31,33,34
    // over lapping --> 2,3,5,6,7,11,14,15,17,21,25,29,30,32
    //vikriti --> 3,5 (pass 4th option as 2nd option BY DEFAULT)
    // ADDING QUESTIONS
    // WEBSITE -- Q11,

    const questionsArray = Object.entries(data).map(([key, options]) => ({
      key,
      label: key.replace(/_/g, " "),
      options,
    }));

    setQuestions(questionsArray);
    const initialFormData = {};
    questionsArray.forEach((question) => {
      initialFormData[question.key] = "";
    });
    setFormData(initialFormData);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const overlappingIndexes = [
    2, 3, 5, 6, 7, 11, 14, 15, 17, 21, 25, 29, 30, 32,
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    console.log(formData);
    const dataArray = [];
    const vikritiArray = [];
    for (const key in formData) {
      const questionNumber = parseInt(key.split(".")[0], 10);
      if (overlappingIndexes.includes(questionNumber)) {
        vikritiArray.push(
          mappings[questionNumber][parseInt(formData[key], 10)]
        );
      }
      dataArray.push(parseInt(formData[key], 10));
    }
    const prakritiArray = dataArray.slice(0, 34);
    vikritiArray.push(...dataArray.slice(34));

    const freq = {};

    for (const num of vikritiArray) {
      freq[num] = (freq[num] || 0) + 1;
    }

    // const percentageFreq = {};
    // for (const key in freq) {
    //   percentageFreq[key] = ((freq[key] / total) * 100).toFixed(2);
    // // }
    // const vataPer = ((freq[0] / 30) * 100).toFixed(2);
    // const pittaPer = ((freq[1] / 30) * 100).toFixed(2);
    // const kaphaPer = ((freq[2] / 30) * 100).toFixed(2);

    // Create object with percentage + label
    let maxPercentage = 0;

    for (const key in freq) {
      const percent = (freq[key] / 30) * 100;
      const label = doshaMap[key] || `Unknown (${key})`;
      labeledPercentages[label] = parseFloat(percent.toFixed(2));

      if (percent > maxPercentage) {
        maxPercentage = percent;
        maxKey = key;
      }
    }

    console.log(doshaMap[maxKey], maxPercentage);
    console.log(labeledPercentages);
    console.log(prakritiArray);
    console.log(vikritiArray);
    setDominantVikrithi(doshaMap[maxKey]);
    let res = "";
    axios
      // .post("https://ayurvision-server.onrender.com/predict", {
      .post(`${import.meta.env.VITE_SERVER_URL}/predict`, {
        data: prakritiArray,
      })
      .then(async (response) => {
        // console.log(response);

        // res = response.data.data;
        // console.log(res);
        res = response.data.prakriti;
        // console.log(res);

        setApiResponse(res);
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    setFormData({});
  };

  const capitalize = (s) =>
    (s && String(s[0]).toUpperCase() + String(s).slice(1)) || "";

  return (
    <>
      <div style={{ marginTop: "70px" }}>
        <Navbar />
      </div>

      <div className="min-h-screen bg-green-100">
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 mt-4">
            Prakriti Identification
          </h1>
          <div className="w-full max-w-3xl bg-white p-8 rounded shadow-md">
            <form onSubmit={handleSubmit} className="w-full">
              {questions.map((question, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {question.label}
                  </h3>
                  <div className="flex flex-col">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center mb-2"
                      >
                        <input
                          type="radio"
                          name={question.key}
                          value={optionIndex}
                          checked={
                            formData[question.key] === optionIndex.toString()
                          }
                          onChange={handleChange}
                          className="form-radio text-indigo-600"
                        />
                        <span className="ml-2">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded ${
                  isSubmitting
                    ? "bg-gray-400"
                    : "bg-indigo-600 text-white hover:bg-green-500 transition duration-200"
                }`}
                disabled={isSubmitting}
              >
                Submit
              </button>
              <div className="flex justify-center items-center my-10">
                {isSubmitting && (
                  <>
                    <p className="text-xl inline px-5">
                      Identifying your prakriti...
                    </p>
                    <MoonLoader
                      loading={isSubmitting}
                      size={24}
                      color={"green"}
                    />
                  </>
                )}
                {apiResponse && !isSubmitting && (
                  <div className="flex justify-center items-center flex-col gap-8">
                    <BarChart dataObject={labeledPercentages} />
                    {dominantVikrithi && (
                      <p className="text-xl">
                        Dominant Vikrithi: <b>{capitalize(dominantVikrithi)}</b>
                      </p>
                    )}
                    <p className="text-xl ">
                      Your Prakriti is: <b>{capitalize(apiResponse)}</b>
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Prakriti;
