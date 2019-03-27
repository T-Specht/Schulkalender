import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import Month from "./Month";
import { Input, Button, Icon } from "semantic-ui-react";
import { AppContext } from "./AppContext";
import { Link } from "react-router-dom";
moment.locale("de");

const Months: React.SFC = () => {
  const context = useContext(AppContext);

  const calcN = () => {
    const windowWidth = window.innerWidth;
    //75px
    const cWidth = 75;

    const nCals = context.calendarGroups.length;
    const calcN = Math.floor(windowWidth / (nCals * cWidth + cWidth * 2));
    return calcN;
  };

  const [n, setN] = useState(calcN());

  const startDate = moment()
    .date(1)
    .hour(0)
    .minute(0);
  const months = new Array(n).fill(null).map((_, i) => {
    let date = startDate.clone().add(i, "month");
    return <Month date={date.clone()} key={i} />;
  });

  const windowResizeHandler = () => {
    setN(calcN());
    return;
  };

  useEffect(() => {
    windowResizeHandler();
    window.addEventListener("resize", windowResizeHandler);
    return () => {
      console.log("Remove");
      window.removeEventListener("resize", windowResizeHandler);
    };
  }, []);

  return (
    <React.Fragment>
      <Input
        type="range"
        max={12}
        min={1}
        onChange={e => setN(parseInt(e.target.value))}
        value={n}
      />
      <Button icon onClick={context.update} basic>
        <Icon name="refresh" />
      </Button>
      <Link to="/edit">Einstellungen</Link>
      <div className="months">{months}</div>
    </React.Fragment>
  );
};

export default Months;
