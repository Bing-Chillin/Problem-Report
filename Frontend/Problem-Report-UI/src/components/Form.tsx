import { PhotoIcon } from "@heroicons/react/24/solid";

function Form() {
  return (
    <form className="mx-60 my-2">
      <div className="space-y-12">
        <div className="border-b border-[#236a75]/10 pb-12">
          <h1 className="text-3xl font-semibold text-[#236a75] mt-5">
            Problémabejelentés
          </h1>

          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm/6 font-medium text-[#236a75]"
                  >
                    Keresztnév
                  </label>
                  <div className="mt-2">
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[#236a75] outline-1 -outline-offset-1 outline-[#236a75] placeholder:text-[#236a75]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[#236a75] sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm/6 font-medium text-[#236a75]"
                  >
                    Vezetéknév
                  </label>
                  <div className="mt-2">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[#236a75] outline-1 -outline-offset-1 outline-[#236a75] placeholder:text-[#236a75]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[#236a75] sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-[#236a75]"
              >
                Email cím
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@email.com"
                  className="block max-w-md w-full rounded-md bg-white px-3 py-1.5 text-base text-[#236a75] outline-1 -outline-offset-1 outline-[#236a75] placeholder:text-[#236a75]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[#236a75] sm:text-sm/6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm/6 font-medium text-[#236a75]"
              >
                Probléma:
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-[#236a75] outline-1 -outline-offset-1 outline-[#236a75] placeholder:text-[#236a75]/50 focus:outline-2 focus:-outline-offset-2 focus:outline-[#236a75] sm:text-sm/6"
                  defaultValue={""}
                />
              </div>

              <div className="col-span-full mt-6">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm/6 font-medium text-[#236a75]"
                >
                  Fényképek feltöltése
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-[#236a75]/75 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      aria-hidden="true"
                      className="mx-auto size-12 text-[#236a75]/30"
                    />
                    <div className="mt-4 flex text-sm/6 text-[#236a75]/80">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-[#236a75] focus-within:ring-2 focus-within:ring-[#236a75] focus-within:ring-offset-2 focus-within:outline-hidden hover:text-[#236a75]/80"
                      >
                        <span>Fájl feltöltése</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">vagy húzd ide</p>
                    </div>
                    <p className="text-xs/5 text-[#236a75]/60">
                      PNG, JPG – legfeljebb 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Form;
