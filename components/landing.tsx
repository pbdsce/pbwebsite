
import React from "react";
import '../app/css/additional-styles/landing.css';
import ImageOne from '../public/images/demo.jpg';
import Image from "next/image";

export default function Landing()
{
    return(
        <>

      <div className="container place-items-center font-bold pt-20 pb-10">
        <h2 className="text-5xl text-white-800 text-center">
           Activities
        </h2>
        <h5 className="text-2xl text-white-800 text-center">
           We organise lots of student centric activities
        </h5>
      </div>


      
    <div className="flex flex-col md:flex-row w-full h- ">
      <div className="highlight flex-1 flex items-center justify-center alip-2 bg-black-800 text-green-500 ">
         <div className="p-8 md:p-16 max-w-lg text-center ">
             <h1 className="text-3xl font-bold mb-4 ">
              COMPETITIVE PROGRAMMING
             </h1>
             <h2 className="text-2xl  font-bold mb-4">
              PB Hustle
             </h2>
             <p className="text-lg text-center md:text-center">
             Point Blank has organized over 40+ editions of its PB Hustle coding contest,
              where participants solve 5-7 increasingly difficult problems in their preferred 
              programming language. The contest aims to enhance the programming culture in colleges
               and help teams qualify for the ACM ICPC. Impressively, DSCE's leading programmers have
                risen through this platform, with participation in the CodeChef Long Challenge expanding 
                from just 3 to over 70+ participants.
             </p>
           </div>
         </div>
        <div className=" highlight flex-1 w-full flex items-center justify-center bg-black-900">
        <Image src={ImageOne} alt='' className=''/>
        </div>
    </div>

    <div className="flex flex-col md:flex-row w-full h-">
        <div className="highlight flex-1 flex items-center justify-center bg-black-500 h-full">
          <Image src={ImageOne} alt='' className=''/>
        </div>
        <div className=" highlight flex-1 flex items-center justify-center alip-8 bg-black-800 text-green-500">
          <div className=" p-8 md:p-16 max-w-lg text-center ">
             <h1 className="text-3xl  font-bold mb-4 ">
              DEVELOPMENT
             </h1>
             <h2 className="text-2xl font-bold mb-4">
              PB Chronicals
             </h2>
             <p className="text-lg text-center md:text-center ">
             Point Blank has hosted over 100+ workshops, covering a wide range 
             of topics including open source, DevOps, machine learning, placement 
             preparation, data structures and algorithms, and mobile and web development, 
             among others. These workshops are typically conducted in an informal and unscripted 
             manner, though we do document some of our most significant sessions. 
             One notable example is our primer on F/OSS development.
             </p>
           </div>
         </div>
        </div>

    <div className="flex flex-col md:flex-row w-full h-">
      <div className="highlight flex-1 flex items-center justify-center alip-8 bg-black-800 text-green-500">
         <div className=" p-8 md:p-16 max-w-lg text-center ">
             <h1 className="text-3xl  font-bold mb-4 ">
             HACKATHONS
             </h1>
             <h2 className="text-2xl  font-bold mb-4">
              Smart India Hackathon
             </h2>
              <p className="text-lg text-center md:text-center">
              Each year, we organize the internal 
              round of the Smart India Hackathon. In the 2020 edition, over 300+ 
              individuals from DSCE participated. Two of our teams advanced to the 
              finals, with one emerging as the winner of the software edition.
              Along with this, teams from Point Blank have won hackathons all across
                the city and country.
             </p>
           </div>
         </div>
        <div className=" highlight flex-1 flex items-center justify-center bg-black-900">
        <Image src={ImageOne} alt='' className=''/>
        </div>
    </div>

    <div className="flex flex-col md:flex-row w-full h-">
      
        <div className="highlight flex-1 flex items-center justify-center bg-black-900">
        <Image src={ImageOne} alt='' className=''/>
        </div>

        <div className="highlight flex-1 flex items-center justify-center alip-8 bg-black-800 text-green-500">
         <div className=" p-8 md:p-16 max-w-lg text-center ">
            <h1 className="text-3xl font-bold mb-4 ">
              CYBER SECURITY
            </h1>
            <h2 className="text-2xl font-bold mb-4">
              PB CTF
            </h2>
            <p className="text-lg text-center md:text-center">
            We organize workshops and sessions on various topics in cybersecurity, 
            including hands-on practice on different platforms. In 2023, we launched 
            the first in-house Capture The Flag event, PBCTF, which attracted over 70+ participants.
             </p>
           </div>
         </div>
      </div>                                               


      <div className="container place-items-center font-bold pt-20 pb-10">
         <h2 className="text-5xl text-white-800 text-center">
           Events
         </h2>
         <h5 className="text-2xl text-white-800 text-center">
           We organise lots of student centric activities
         </h5>
      </div>

      <div className="view">
       <EventComponent></EventComponent>
      </div>


      <div className="container place-items-center font-bold pt-20 pb-10">
        <h2 className="text-5xl text-white-800 text-center">
          Leads
        </h2>
      </div>

      <div className="view">
          
        <CardComponents></CardComponents>
      
      </div>

      <div className="view">
        
        <CardComponents></CardComponents>

      </div>
  </>
    )
}



const leads = [
  { id: 0, text: "lead 1" },
  { id: 1, text: "lead 2" },
  { id: 2, text: "lead 3" }
];

const eventCard = [
  { id:4 ,textt:"Back of Card", textb:"Additional info on the back of the card"},
  { id:5 ,textt:"Back of Card", textb:"Additional info on the back of the card"},
  { id:6 ,textt:"Back of Card", textb:"Additional info on the back of the card"},
  
];

const CardComponents = () => {
  return (
    <>
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="box card-wrapper transition-transform duration-1000 ease-in-out transform hover:scale-105 hover:shadow-2xl"
        >
          <h1 className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-3xl text-base text-center text-green-600">
            {lead.text}
          </h1>
        </div>
      ))}
    </>
  );
};



const EventComponent = () => {
  return (
    <>
    {eventCard.map((ec) => (
      <div>
         <div  key={ec.id} 
         className="event-card">
         <div className="card">
           <div className="front"></div>
              <div className="back">
                 <h2>{ec.textt}</h2>
                 <p className='text-center'>{ec.textb}</p>
              </div>
           </div>
        </div>
      </div>
    ))}
    </>
  )
}