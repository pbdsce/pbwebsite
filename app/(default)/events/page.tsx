"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/Firebase"; 
import "./Events.css"
import { useRouter } from "next/navigation";
import { color } from "framer-motion";
type Event = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: Date;
  endDate: Date;
};

export default function Events() {
    const router = useRouter();

    useEffect(() => {
        router.push("/")
    });

  const [events, setEvents] = useState<Event[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
      setEvents(eventsData);
    };

    fetchEvents();
  }, []);

  const ongoingEvents = events.filter(
    (event) =>
      new Date(event.startDate) <= new Date() &&
      new Date(event.endDate) >= new Date()
  );
  const futureEvents = events.filter(
    (event) => new Date(event.startDate) > new Date()
  );
  const pastEvents = events.filter(
    (event) => new Date(event.endDate) < new Date()
  );

  return (
    <>
      <div className="container place-items-center font-bold pt-20 pb-10">
        <h1 className="text-5xl text-center">Welcome to Point Blank</h1>

        <h2 className="text-3xl text-center">Ongoing Events</h2>
        <div className="events-grid">
          <div key="sih-registrations" className="event-card wide-card transition-card">
            <img src="data:image/png;base64,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" alt="Sih registrations" />
            <h3>Sih registrations</h3>
            <p>Description for Sih registrations</p>
          </div>
        </div>

        <h2 className="text-3xl text-center">Future Events</h2>
        <div className="events-grid">
          <div key="pb-recruitment" className="event-card transition-card">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA+VBMVEUAAAACAAMAAAICAAEAAwA9/wAABAAFAAcAAAVE/gAFAARE/AgAAAcGAAgGAAAAAgMAFAAJAAwBAAsADABU+iMAGQAHAA9X9CdI+Qpc6zcACAAKAAhHfDgHHQRHgDcyXihZ1Dg9hShClCsJLAdUsTZh6DsPOw9Mti8LOwRi4j9P9xVMwzM3iCMiTBhnz0Fg8jUvYyIkVBwAJgI0eSZe4DRt5VEzUDBp4D0ePxtbx0MSNQ5NoSozbiZf10NBgSlQozgHIQAUSw0nZRsRLRBJkzNJsDIbRQ4pViNP1yYALgA3WSorSx8wdBxTqTIgWhZLlDcjPBxBpChctEEac9q/AAAJAElEQVR4nO2a+3fTOBaAr2TZkuWHamNiJ1mWtPRBUmha6NItLdPyKvOAncf//8fsvXIKZYYDBJx4zpz79QfOaankz5LuQykAwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzCfQJo0tSoyOuh65CAQRgUWlDKy67GXQ0VKDEoZiW4dhY1EOrCRUtD5y1sKFeQikxv/ulXYjge24zv/3gCTaaG6HXlJcH9KuDupN0F0OzBqbVWTu2AK3auhggzubQ+beOee7XiXwu4wToZ79yFNXacjfx1oE6QYCAqAzeksjpNmD8aiuydxoGE/ieMw2XkAqbYWnFQgOt4nnyHIA2kMHZCHB1WMJOH8UOruYl4g4HweJugYV6dHoK1yNgIh17dhjdYuH8tHr2tawLiZJc10AyLoJO4FAY50Z9rETRziKs7q148gU0q7tcXVgBYwH6fw+HgWxviiQ3zVs/88IcMuljHI8Xw/OaGxQxw6DJPpOYDWEKlgXZlDGpT572mVIA0aJs18+yk+QDejk4aCR2dzGjqmOZJqcgUwWtseVUrkMNramdHcMT1CdfAGMtth7SGFTuHhfoWK3jFMhmcbuIxq5ZImz3PnbAHnzyqywx2Eq3j8A5hSIp3NgyO5DPAYJO0seAya6VvIRBRBbk1n83xiZudcruHp3ryJ2/0ThvXFJZYeHadDxGoBt7fqMGxazaY+3YVBoUZqpYdRKUx6W0PcNuiGrzaZHzyHQZnZvPtpXToYwP39OvF7NaatuoXbyKx2qxZjeDFpMAS0IbQ5xiinnMM5O+4AJHYVYK3L4XzaJP40Yl0xm7ygZex0po8x8HK7pgBHWTCuTs4uQeCmobfa8eEIhAgwqAbCwq2taUXzYdgOk/n2LtCPup1NLsbDommTIihuGtylTb33iy+MpRXWYHjtGJtp54SymYXdvTqJ/bHA6mJnE67L/M5ELdZnWFMYeDip4jZHhWE1OQToXOsDwXsgl3CIM+Nrjen8VxOs43SApyK3CuSX+KrZlCi0TTfe1RhBm4aC6Gz4agSZWeGJ+GAYRCalCt9XwA09Qr19W1qb4Qp+0e9rDKWIVFGU8Pa48ruToky19xL0OFvl9cINQyWzTMOd13VbYOBizo43ocywAEjNFyW/PJUQkcng6pQyU+jHbw6O0HvFZfANQ2xlFGYJeIh1Ir3juMEsfPoc91CkuzCUUhVwFyMMVcEYzmbYspnUQtBlEfN5Q2lkoCJdwibuo9g/SNLsvJGZEqKDXRoYZ+ExjUwxNEx+/EliIxPYrCzxHAZrAGtCjAPByAn46Uf08+sYVudgjRVf5CsM0zQ33tBH7GR+egU2N85JAWodgkEgKOXaAovxU0wbje+5k+o8zcss78AQT0Ce/ryDex9Tbtsqbd3BthsnxQOyDvAYKpUN5OXF3D+Fb43rk1/KPE2DLgwx7wzgCpNu2KakOKmmjyEvCi3WIojbVFhsuLHa8M2UPyv1610ocyk7MsSSbGBeUNL1DYUPZW/ADEy0Dj+h0sznfNLDfIj/VPtHYEQqKNJ/v6EPRiLFynrzZNb4aEOXa/Ptl2Dbc7jqcOOoX8NkSHYUSStsFe2YijqMsh2tIaYGg8l14x32TW1fiAd++GAEwXiM1TFdI3at5QtC6YKikPLO2ZxSRJsnmumrW4BB1AgnMS13ZQiUVwJIj/brRcjBwFofvAAYjexYiFWcSKyHx3Y0Anj7jGJAW80k87379MKlMT7bdWdIODEosV2bhe3FAhY39d4upFZojf14x3oQWE1NCzzfr3x/6NNVNfkf6MGNfN6toUlHtoBbD9CRihtfpO78ehvSIPu04fU3v8Xe32IYuLwYxot2DfuZk7eQDuyorVRWYCiNirBfg8t3c2zz232TNMePgW4z3V80aC/hQfnGQIQNPo67OWyLbYpts/nZBgwGWkXGrMgQO0VcRxdYuuhrSyf8aurTIxCZo9EWNnnqIEvxKW7R72gqSpZDYG+vAQ4PKh+7KcrEFZ4II10UBcUKDdvtgVsVzo8r/2bpRDbzPy4xPQmscxaGpaIi4d10ON0+hIFdzpBabotzPH1dN+0dFBZSNR7ANDOOSm240ReuwBAnUAZdNn7FQs5nDgytM7paUNYu1lDIHIv1+cwHozPQyxV3ZBDB7a3hbHHnjdtlB49CUQTK/blzWImhv64dF7C7PWzamBpSkfMEq7u8dUlVXuzu0I0/Pt38HFK5lCF29fDkmd8j7ecWw4uXeA5KocRX9BLfb4hFIkRKOT2Ao716UeiH8fA3/MHiGVM1llutfRw3B1CaJddQwW/DJsYKis45lWhjG9FH+lrbP7GaXYr1jQAHlqrFg8rH1LDepOkX51CoAez7+I6NQLhzaZfaprgX8CX+UPvPD8MKywqT5SCV1rkU6zEEozGu4KHQGd0vNlTjTCCzFAX8oLkdwAF9KkWFVji8p/WSGUMEGezT22mOH6CwThXkATbBavlN+k3n0AczX8eBMHDv92GTDK9K/aHQD0QJp77LoW7r5PIb2iwLV3MsfX/HDHGdUP3f2KzJ8ANOY9662p+/Aiz03w+aOgub9AknHaTZH+CWvwvAU7BV7+9SD2FubID1G4o812UJdzdyuhq/HrR0efnopPEtSDg/KpfdpGRoi9uH9EcKudU3IvH6DQO6QRFjPJoYL98nJ+1UAUdD6pgpU5Z6aUFEYQbMMH7mN8PU+g0l9jDC0ZUb3a9fD5oLZ8fm3sVkONl+CAU1csuuItYPQkXYW5iPCt4eDK8TiO/Zbg5sr/8MzIrr//UNj9cB32v48an8iIg+z6FfcZ/88T/AsEUuUyWvgtUbfv7Hq2eFhovf+AevIdDdFX1T0ldfgqvfpb3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3Dhmz49zf8Pyu98Xh51BTrAAAAAElFTkSuQmCC" alt="Pb recruitment" />

            <h3>Pb recruitment</h3>
            <p>Description for Pb recruitment</p>
          </div>
          <div key="pbctf" className="event-card transition-card">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA+VBMVEUAAAACAAMAAAICAAEAAwA9/wAABAAFAAcAAAVE/gAFAARE/AgAAAcGAAgGAAAAAgMAFAAJAAwBAAsADABU+iMAGQAHAA9X9CdI+Qpc6zcACAAKAAhHfDgHHQRHgDcyXihZ1Dg9hShClCsJLAdUsTZh6DsPOw9Mti8LOwRi4j9P9xVMwzM3iCMiTBhnz0Fg8jUvYyIkVBwAJgI0eSZe4DRt5VEzUDBp4D0ePxtbx0MSNQ5NoSozbiZf10NBgSlQozgHIQAUSw0nZRsRLRBJkzNJsDIbRQ4pViNP1yYALgA3WSorSx8wdBxTqTIgWhZLlDcjPBxBpChctEEac9q/AAAJAElEQVR4nO2a+3fTOBaAr2TZkuWHamNiJ1mWtPRBUmha6NItLdPyKvOAncf//8fsvXIKZYYDBJx4zpz79QfOaankz5LuQykAwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzCfQJo0tSoyOuh65CAQRgUWlDKy67GXQ0VKDEoZiW4dhY1EOrCRUtD5y1sKFeQikxv/ulXYjge24zv/3gCTaaG6HXlJcH9KuDupN0F0OzBqbVWTu2AK3auhggzubQ+beOee7XiXwu4wToZ79yFNXacjfx1oE6QYCAqAzeksjpNmD8aiuydxoGE/ieMw2XkAqbYWnFQgOt4nnyHIA2kMHZCHB1WMJOH8UOruYl4g4HweJugYV6dHoK1yNgIh17dhjdYuH8tHr2tawLiZJc10AyLoJO4FAY50Z9rETRziKs7q148gU0q7tcXVgBYwH6fw+HgWxviiQ3zVs/88IcMuljHI8Xw/OaGxQxw6DJPpOYDWEKlgXZlDGpT572mVIA0aJs18+yk+QDejk4aCR2dzGjqmOZJqcgUwWtseVUrkMNramdHcMT1CdfAGMtth7SGFTuHhfoWK3jFMhmcbuIxq5ZImz3PnbAHnzyqywx2Eq3j8A5hSIp3NgyO5DPAYJO0seAya6VvIRBRBbk1n83xiZudcruHp3ryJ2/0ThvXFJZYeHadDxGoBt7fqMGxazaY+3YVBoUZqpYdRKUx6W0PcNuiGrzaZHzyHQZnZvPtpXToYwP39OvF7NaatuoXbyKx2qxZjeDFpMAS0IbQ5xiinnMM5O+4AJHYVYK3L4XzaJP40Yl0xm7ygZex0po8x8HK7pgBHWTCuTs4uQeCmobfa8eEIhAgwqAbCwq2taUXzYdgOk/n2LtCPup1NLsbDommTIihuGtylTb33iy+MpRXWYHjtGJtp54SymYXdvTqJ/bHA6mJnE67L/M5ELdZnWFMYeDip4jZHhWE1OQToXOsDwXsgl3CIM+Nrjen8VxOs43SApyK3CuSX+KrZlCi0TTfe1RhBm4aC6Gz4agSZWeGJ+GAYRCalCt9XwA09Qr19W1qb4Qp+0e9rDKWIVFGU8Pa48ruToky19xL0OFvl9cINQyWzTMOd13VbYOBizo43ocywAEjNFyW/PJUQkcng6pQyU+jHbw6O0HvFZfANQ2xlFGYJeIh1Ir3juMEsfPoc91CkuzCUUhVwFyMMVcEYzmbYspnUQtBlEfN5Q2lkoCJdwibuo9g/SNLsvJGZEqKDXRoYZ+ExjUwxNEx+/EliIxPYrCzxHAZrAGtCjAPByAn46Uf08+sYVudgjRVf5CsM0zQ33tBH7GR+egU2N85JAWodgkEgKOXaAovxU0wbje+5k+o8zcss78AQT0Ce/ryDex9Tbtsqbd3BthsnxQOyDvAYKpUN5OXF3D+Fb43rk1/KPE2DLgwx7wzgCpNu2KakOKmmjyEvCi3WIojbVFhsuLHa8M2UPyv1610ocyk7MsSSbGBeUNL1DYUPZW/ADEy0Dj+h0sznfNLDfIj/VPtHYEQqKNJ/v6EPRiLFynrzZNb4aEOXa/Ptl2Dbc7jqcOOoX8NkSHYUSStsFe2YijqMsh2tIaYGg8l14x32TW1fiAd++GAEwXiM1TFdI3at5QtC6YKikPLO2ZxSRJsnmumrW4BB1AgnMS13ZQiUVwJIj/brRcjBwFofvAAYjexYiFWcSKyHx3Y0Anj7jGJAW80k87379MKlMT7bdWdIODEosV2bhe3FAhY39d4upFZojf14x3oQWE1NCzzfr3x/6NNVNfkf6MGNfN6toUlHtoBbD9CRihtfpO78ehvSIPu04fU3v8Xe32IYuLwYxot2DfuZk7eQDuyorVRWYCiNirBfg8t3c2zz232TNMePgW4z3V80aC/hQfnGQIQNPo67OWyLbYpts/nZBgwGWkXGrMgQO0VcRxdYuuhrSyf8aurTIxCZo9EWNnnqIEvxKW7R72gqSpZDYG+vAQ4PKh+7KcrEFZ4II10UBcUKDdvtgVsVzo8r/2bpRDbzPy4xPQmscxaGpaIi4d10ON0+hIFdzpBabotzPH1dN+0dFBZSNR7ANDOOSm240ReuwBAnUAZdNn7FQs5nDgytM7paUNYu1lDIHIv1+cwHozPQyxV3ZBDB7a3hbHHnjdtlB49CUQTK/blzWImhv64dF7C7PWzamBpSkfMEq7u8dUlVXuzu0I0/Pt38HFK5lCF29fDkmd8j7ecWw4uXeA5KocRX9BLfb4hFIkRKOT2Ao716UeiH8fA3/MHiGVM1llutfRw3B1CaJddQwW/DJsYKis45lWhjG9FH+lrbP7GaXYr1jQAHlqrFg8rH1LDepOkX51CoAez7+I6NQLhzaZfaprgX8CX+UPvPD8MKywqT5SCV1rkU6zEEozGu4KHQGd0vNlTjTCCzFAX8oLkdwAF9KkWFVji8p/WSGUMEGezT22mOH6CwThXkATbBavlN+k3n0AczX8eBMHDv92GTDK9K/aHQD0QJp77LoW7r5PIb2iwLV3MsfX/HDHGdUP3f2KzJ8ANOY9662p+/Aiz03w+aOgub9AknHaTZH+CWvwvAU7BV7+9SD2FubID1G4o812UJdzdyuhq/HrR0efnopPEtSDg/KpfdpGRoi9uH9EcKudU3IvH6DQO6QRFjPJoYL98nJ+1UAUdD6pgpU5Z6aUFEYQbMMH7mN8PU+g0l9jDC0ZUb3a9fD5oLZ8fm3sVkONl+CAU1csuuItYPQkXYW5iPCt4eDK8TiO/Zbg5sr/8MzIrr//UNj9cB32v48an8iIg+z6FfcZ/88T/AsEUuUyWvgtUbfv7Hq2eFhovf+AevIdDdFX1T0ldfgqvfpb3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3Dhmz49zf8Pyu98Xh51BTrAAAAAElFTkSuQmCC" alt="Pbctf" />
            <h3>Pbctf</h3>
            <p>Description for Pbctf</p>
          </div>
          <div key="pbthon" className="event-card transition-card">
            <img src="data:image/png;base64,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" alt="Pbthon" />
            <h3>Pbthon</h3>
            <p>Description for Pbthon</p>
          </div>
        </div>

        <h2 className="text-3xl text-center">Past Events</h2>
        <div className="events-grid">
          <div key="pbctf-2.0" className="event-card transition-card">
            <img src="data:image/png;base64,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" alt="Pbctf 2.0" />
            <h3>Pbctf 2.0</h3>
            <p>Description for Pbctf 2.0</p>
          </div>
          <div key="pb-recruitment-2023-24" className="event-card transition-card">
            <img src="data:image/png;base64,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" alt="Pb recruitment 2023-24" />
            <h3>Pb recruitment 2023-24</h3>
            <p>Description for Pb recruitment 2023-24</p>
          </div>
          <div key="pb-hustle" className="event-card transition-card">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA+VBMVEUAAAACAAMAAAICAAEAAwA9/wAABAAFAAcAAAVE/gAFAARE/AgAAAcGAAgGAAAAAgMAFAAJAAwBAAsADABU+iMAGQAHAA9X9CdI+Qpc6zcACAAKAAhHfDgHHQRHgDcyXihZ1Dg9hShClCsJLAdUsTZh6DsPOw9Mti8LOwRi4j9P9xVMwzM3iCMiTBhnz0Fg8jUvYyIkVBwAJgI0eSZe4DRt5VEzUDBp4D0ePxtbx0MSNQ5NoSozbiZf10NBgSlQozgHIQAUSw0nZRsRLRBJkzNJsDIbRQ4pViNP1yYALgA3WSorSx8wdBxTqTIgWhZLlDcjPBxBpChctEEac9q/AAAJAElEQVR4nO2a+3fTOBaAr2TZkuWHamNiJ1mWtPRBUmha6NItLdPyKvOAncf//8fsvXIKZYYDBJx4zpz79QfOaankz5LuQykAwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzCfQJo0tSoyOuh65CAQRgUWlDKy67GXQ0VKDEoZiW4dhY1EOrCRUtD5y1sKFeQikxv/ulXYjge24zv/3gCTaaG6HXlJcH9KuDupN0F0OzBqbVWTu2AK3auhggzubQ+beOee7XiXwu4wToZ79yFNXacjfx1oE6QYCAqAzeksjpNmD8aiuydxoGE/ieMw2XkAqbYWnFQgOt4nnyHIA2kMHZCHB1WMJOH8UOruYl4g4HweJugYV6dHoK1yNgIh17dhjdYuH8tHr2tawLiZJc10AyLoJO4FAY50Z9rETRziKs7q148gU0q7tcXVgBYwH6fw+HgWxviiQ3zVs/88IcMuljHI8Xw/OaGxQxw6DJPpOYDWEKlgXZlDGpT572mVIA0aJs18+yk+QDejk4aCR2dzGjqmOZJqcgUwWtseVUrkMNramdHcMT1CdfAGMtth7SGFTuHhfoWK3jFMhmcbuIxq5ZImz3PnbAHnzyqywx2Eq3j8A5hSIp3NgyO5DPAYJO0seAya6VvIRBRBbk1n83xiZudcruHp3ryJ2/0ThvXFJZYeHadDxGoBt7fqMGxazaY+3YVBoUZqpYdRKUx6W0PcNuiGrzaZHzyHQZnZvPtpXToYwP39OvF7NaatuoXbyKx2qxZjeDFpMAS0IbQ5xiinnMM5O+4AJHYVYK3L4XzaJP40Yl0xm7ygZex0po8x8HK7pgBHWTCuTs4uQeCmobfa8eEIhAgwqAbCwq2taUXzYdgOk/n2LtCPup1NLsbDommTIihuGtylTb33iy+MpRXWYHjtGJtp54SymYXdvTqJ/bHA6mJnE67L/M5ELdZnWFMYeDip4jZHhWE1OQToXOsDwXsgl3CIM+Nrjen8VxOs43SApyK3CuSX+KrZlCi0TTfe1RhBm4aC6Gz4agSZWeGJ+GAYRCalCt9XwA09Qr19W1qb4Qp+0e9rDKWIVFGU8Pa48ruToky19xL0OFvl9cINQyWzTMOd13VbYOBizo43ocywAEjNFyW/PJUQkcng6pQyU+jHbw6O0HvFZfANQ2xlFGYJeIh1Ir3juMEsfPoc91CkuzCUUhVwFyMMVcEYzmbYspnUQtBlEfN5Q2lkoCJdwibuo9g/SNLsvJGZEqKDXRoYZ+ExjUwxNEx+/EliIxPYrCzxHAZrAGtCjAPByAn46Uf08+sYVudgjRVf5CsM0zQ33tBH7GR+egU2N85JAWodgkEgKOXaAovxU0wbje+5k+o8zcss78AQT0Ce/ryDex9Tbtsqbd3BthsnxQOyDvAYKpUN5OXF3D+Fb43rk1/KPE2DLgwx7wzgCpNu2KakOKmmjyEvCi3WIojbVFhsuLHa8M2UPyv1610ocyk7MsSSbGBeUNL1DYUPZW/ADEy0Dj+h0sznfNLDfIj/VPtHYEQqKNJ/v6EPRiLFynrzZNb4aEOXa/Ptl2Dbc7jqcOOoX8NkSHYUSStsFe2YijqMsh2tIaYGg8l14x32TW1fiAd++GAEwXiM1TFdI3at5QtC6YKikPLO2ZxSRJsnmumrW4BB1AgnMS13ZQiUVwJIj/brRcjBwFofvAAYjexYiFWcSKyHx3Y0Anj7jGJAW80k87379MKlMT7bdWdIODEosV2bhe3FAhY39d4upFZojf14x3oQWE1NCzzfr3x/6NNVNfkf6MGNfN6toUlHtoBbD9CRihtfpO78ehvSIPu04fU3v8Xe32IYuLwYxot2DfuZk7eQDuyorVRWYCiNirBfg8t3c2zz232TNMePgW4z3V80aC/hQfnGQIQNPo67OWyLbYpts/nZBgwGWkXGrMgQO0VcRxdYuuhrSyf8aurTIxCZo9EWNnnqIEvxKW7R72gqSpZDYG+vAQ4PKh+7KcrEFZ4II10UBcUKDdvtgVsVzo8r/2bpRDbzPy4xPQmscxaGpaIi4d10ON0+hIFdzpBabotzPH1dN+0dFBZSNR7ANDOOSm240ReuwBAnUAZdNn7FQs5nDgytM7paUNYu1lDIHIv1+cwHozPQyxV3ZBDB7a3hbHHnjdtlB49CUQTK/blzWImhv64dF7C7PWzamBpSkfMEq7u8dUlVXuzu0I0/Pt38HFK5lCF29fDkmd8j7ecWw4uXeA5KocRX9BLfb4hFIkRKOT2Ao716UeiH8fA3/MHiGVM1llutfRw3B1CaJddQwW/DJsYKis45lWhjG9FH+lrbP7GaXYr1jQAHlqrFg8rH1LDepOkX51CoAez7+I6NQLhzaZfaprgX8CX+UPvPD8MKywqT5SCV1rkU6zEEozGu4KHQGd0vNlTjTCCzFAX8oLkdwAF9KkWFVji8p/WSGUMEGezT22mOH6CwThXkATbBavlN+k3n0AczX8eBMHDv92GTDK9K/aHQD0QJp77LoW7r5PIb2iwLV3MsfX/HDHGdUP3f2KzJ8ANOY9662p+/Aiz03w+aOgub9AknHaTZH+CWvwvAU7BV7+9SD2FubID1G4o812UJdzdyuhq/HrR0efnopPEtSDg/KpfdpGRoi9uH9EcKudU3IvH6DQO6QRFjPJoYL98nJ+1UAUdD6pgpU5Z6aUFEYQbMMH7mN8PU+g0l9jDC0ZUb3a9fD5oLZ8fm3sVkONl+CAU1csuuItYPQkXYW5iPCt4eDK8TiO/Zbg5sr/8MzIrr//UNj9cB32v48an8iIg+z6FfcZ/88T/AsEUuUyWvgtUbfv7Hq2eFhovf+AevIdDdFX1T0ldfgqvfpb3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3DhmzIhv3Dhmz49zf8Pyu98Xh51BTrAAAAAElFTkSuQmCC" alt="Pb hustle" />
            <h3>Pb hustle</h3>
            <p>Description for Pb hustle</p>
          </div>
        </div>

        {isAdmin && (
          <div className="admin-panel">
            <h2 className="text-3xl text-center">Create a New Event</h2>
            <form className="event-form">
              <input type="text" placeholder="Event Title" />
              <input type="text" placeholder="Event Description" />
              <input type="url" placeholder="Image URL" />
              <input type="date" placeholder="Start Date" />
              <input type="date" placeholder="End Date" />
              <button type="submit">Create Event</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}














// import EventComponent from "@/components/eventcards"


// export const metadata = {
//     title: 'Events',
//     description: 'Events page',
// }
// export default function Events() {
//     return (
//         <>
//         <EventComponent/>
//         </>
//     )
// }