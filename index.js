import { Header, Nav, Main, Footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";

const router = new Navigo("/");

function render(state = store.Home) {
  console.table(`${state}`);
  document.querySelector("#root").innerHTML = `

  ${Nav(store.Links)}
  ${Header(state)}
  ${Main(state)}
  ${Footer(state)}
`;

  router.updatePageLinks();
}
// function afterRender(state) {
//   document.querySelector(".fa-bars").addEventListener("click", () => {
//     document.querySelector("nav > ul").classList.toggle("hidden--mobile");
//   });

router.hooks({
  before: (done, params) => {
    const view =
      params && params.data && params.data.view
        ? capitalize(params.data.view)
        : "Home"; // Add a switch case statement to handle multiple routes
    switch (view) {
      case "Home":
        axios
          .get(
            // Replace the key provided here with your own key from openweathermap
            `https://api.openweathermap.org/data/2.5/weather?q=st%20louis&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`
          )
          .then(response => {
            const kelvinToFahrenheit = kelvinTemp =>
              Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);
            store.Home.weather = {};
            store.Home.weather.city = response.data.name;
            store.Home.weather.temp = kelvinToFahrenheit(
              response.data.main.temp
            );
            store.Home.weather.feelsLike = kelvinToFahrenheit(
              response.data.main.feels_like
            );
            store.Home.weather.description = response.data.weather[0].main;
            done();
          })
          .catch(err => console.log(err));
        break;
      // New Case for Pizza View
      // case "Rate":
      //   axios
      //     .get("http://universities.hipolabs.com/search?name=middle")
      //     .then(response => {
      //       console.log(response.data);
      //     });
      //   break;
      default:
        done();
    }
  }
});
router
  .on({
    "/": () => render(),
    ":view": params => {
      let view = capitalize(params.data.view);
      render(store[view]);
    }
  })
  .resolve();
