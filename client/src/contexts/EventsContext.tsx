import { Dispatch, createContext, useReducer, useEffect } from "react";
import { EventInput } from "@fullcalendar/core/index.js";
import { ACTIONTYPE, eventsReducer } from "../reducers/eventsReducer";
//import axios from "axios";
import { useAxiosContext } from "./AxiosContext";

export const EventsContext = createContext<EventInput[]>([]);
export const EventsDispatchContext = createContext<Dispatch<ACTIONTYPE> | null>(
  null,
);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, dispatch] = useReducer(eventsReducer, []);
  const { customAxios } = useAxiosContext();

  useEffect(() => {
    //fetchEvents()
    //  .then((res) => {
    //    dispatch({
    //      type: "fetched",
    //      payload: res.data,
    //    });
    //  })
    //  .catch((err) => console.log(err));
    customAxios.get("api/events").then((res) =>
      dispatch({
        type: "fetched",
        payload: res.data,
      }),
    );
  }, []);

  // async function fetchEvents() {
  //   //return await axios.get("http://localhost:4000/events");
  //   return await axios.get("/api/events");
  // }

  return (
    <EventsContext.Provider value={events}>
      <EventsDispatchContext.Provider value={dispatch}>
        {children}
      </EventsDispatchContext.Provider>
    </EventsContext.Provider>
  );
}
