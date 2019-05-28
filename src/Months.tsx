import React, { useState, useContext, useEffect, useCallback } from "react";
import moment from "moment";
import Month from "./Month";
import { Input, Button, Icon, Dropdown, Checkbox } from "semantic-ui-react";
import { AppContext } from "./AppContext";
import { Link } from "react-router-dom";
import Hammer from "react-hammerjs";
import HammerJS from "hammerjs";

moment.locale("de");

const Months: React.SFC = () => {
  const context = useContext(AppContext);

  const calcN = () => {
    const windowWidth = window.innerWidth;
    //75px
    const cWidth = 75;
    const nCals = context.calendarGroups.filter(g => g.active).length;
    const calcN = Math.floor(windowWidth / (nCals * cWidth + cWidth * 2));
    return calcN;
  };

  const [n, setN] = useState(calcN());
  const [autoN, setAutoN] = useState(true);
  const currentMonth = moment()
    .date(1)
    .hour(0)
    .minute(0);

  const [startDate, setStartDate] = useState(currentMonth.clone());

  const [startDateChanged, setStartDateChanged] = useState(false);

  const months = new Array(n).fill(null).map((_, i) => {
    let date = startDate.clone().add(i, "month");
    return <Month date={date.clone()} key={i} />;
  });

  const windowResizeHandler = useCallback(() => {
    if (autoN) {
      setN(calcN());
    }
    return;
  }, [autoN]);

  useEffect(() => {
    windowResizeHandler();
    window.addEventListener("resize", windowResizeHandler);
    return () => {
      console.log("Remove");
      window.removeEventListener("resize", windowResizeHandler);
    };
  }, [autoN]);

  // Fetch Data upon load
  useEffect(() => {
    // Fetch Data on First Load
    context.update();
    console.log(new Date().toLocaleTimeString() + ": Initial fetch of data...");

    // Update data every x ms
    let interval = setInterval(() => {
      context.update();
      console.log(new Date().toLocaleTimeString() + ": Updating Calendar...");
    }, context.updateInterval * 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  const nextMonth = () => {
    setStartDate(startDate.clone().add(1, "month"));
  };
  const previousMonth = () => {
    setStartDate(startDate.clone().subtract(1, "month"));
  };

  const resetStartDate = () => {
    setStartDate(currentMonth.clone());
  };

  const onDropDownSelect = (value: any) => {
    if (value == -1) {
      setAutoN(true);
      setN(calcN());
    } else {
      setAutoN(false);
      setN(value);
    }
  };

  const onSwipe = (e: HammerInput) => {
    if (e.direction == HammerJS.DIRECTION_LEFT) {
      nextMonth();
    } else if (e.direction == HammerJS.DIRECTION_RIGHT) {
      previousMonth();
    }
  };

  return (
    <React.Fragment>
      {/* 
      <Button icon onClick={context.update} basic>
        <Icon name="refresh" />
      </Button> */}

      <div id="toolbar">
        {!startDate.isSame(currentMonth, "month") && (
          <Button size="mini" onClick={resetStartDate}>Zurück zum aktuellen Monat</Button>
        )}
        {context.calendarGroups.map((g, i) => {
          return (
            <Checkbox
              key={g.uuid}
              label={g.name}
              checked={g.active}
              onChange={(e, checkbox) => {
                context.setCalendarGroupActiveStatus(g.uuid, checkbox.checked!);
                windowResizeHandler();
              }}
            />
          );
        })}
        <Dropdown
          size="mini"
          selection
          compact
          options={[
            {
              key: -1,
              text: "Auto",
              value: -1
            },
            ...new Array(12).fill(null).map((_, i) => ({
              key: i,
              text: (i + 1).toString(),
              value: i + 1
            }))
          ]}
          onChange={(e, dropdown) => onDropDownSelect(dropdown.value)}
          value={autoN ? -1 : n}
        />
        <Button onClick={previousMonth} icon>
          <Icon name="chevron left" />
        </Button>
        <Button onClick={nextMonth} icon>
          <Icon name="chevron right" />
        </Button>
      </div>

      <Hammer onSwipe={onSwipe} direction="DIRECTION_HORIZONTAL">
        <div className="months">{months}</div>
      </Hammer>
      <div
        style={{
          textAlign: "right",
          padding: 10
        }}
      >
        <Link to="/edit">Einstellungen</Link>
      </div>
    </React.Fragment>
  );
};

export default Months;
