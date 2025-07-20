import {
  faBug,
  faLightbulb,
  faPhoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// function Frontpage() {
//   return (
//     <>
//       <div
//         id="frontpage"
//         className="h-screen w-full bg-cover bg-center"
//         style={{ backgroundImage: 'url("/phone.jpg")' }}
//       >
//         <h1 className="text-7xl text-white font-bold pt-3.5">TITLE</h1>
//       </div>
//     </>
//   );
// }
//
// export default Frontpage;
//

function Frontpage() {
  return (
    <>
      <div
        id="frontpage"
        className="h-screen w-full bg-cover bg-center flex items-center justify-center text-center px-4"
        style={{ backgroundImage: 'url("/phone.jpg")' }}
      >
        <div className=" bg-opacity-50 p-6 rounded-xl">
          <h1 className="text-6xl md:text-7xl text-white font-extrabold mb-4">
            TITLE
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
            Welcome to our system. Quickly report issues, track progress, and
            collaborate with your team efficiently.
          </p>
          {/* <FontAwesomeIcon icon="fa-solid fa-lightbulb" /> */}
        </div>
      </div>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-14.5">
          <h2 className="text-3xl font-semibold mb-4">Our Features</h2>
          <p className="text-gray-600">
            Here's a glimpse of what our platform can do for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-7xl mx-auto">
          <div className="rounded-lg overflow-hidden">
            <div className="text-black text-9xl text-center pb-8">
              <FontAwesomeIcon icon={faPhoneSlash} />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-xl mb-2">Easy Reporting</h3>
              <p className="text-gray-600">
                Submit issues effortlessly with our simple form.
              </p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden">
            <div className="text-black text-9xl text-center pb-8">
              <FontAwesomeIcon icon={faLightbulb} />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-xl mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Communicate clearly with developers and admins.
              </p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden ">
            <div className="text-black text-9xl text-center pb-8">
              <FontAwesomeIcon icon={faBug} />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-xl mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Stay up-to-date with issue statuses and updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Frontpage;
