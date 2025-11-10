import React, { useEffect, useState } from "react";
import { formatNumber } from "../../lib/helper";
import { useSelector } from "react-redux";

const Stats = () => {

  const [revenueChange ,setRevenueChange] = useState("");

  const {
    totalUsersCount,
    todayRevenue,
    yesterdayRevenue,
    totalRevenueAllTime,
  } = useSelector((state) => state.admin);
  

  const state = [
    {
      title : "Today's Revenue",
      value:formatNumber(todayRevenue),
      change : revenueChange
    },
    {
      title : "Total Users",
      value: totalUsersCount || 0,
      change: null
    },
    {
      title: "All time Revenue",
      value : formatNumber(totalRevenueAllTime),
      change: null,

    },
  ];

  useEffect(() => {
    if(yesterdayRevenue){
    let change = 
    yesterdayRevenue ===0
    ? 100
    : ((totalRevenue -yesterdayRevenue) / yesterdayRevenue) * 100;
    const revenueChangeText = `${change >= 0 ? "+" : "-" }${change.toFixed(
      2
    )}% from yesterday`;
    setRevenueChange(revenueChangeText);
  }
  }, [yesterdayRevenue]);

  return <>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {
      state.map((state,index) => {
        return (
          <div
          key={index}
          className={`bg-white p-4 rounded-xl shadow-md ${
            index !==0 && "flex gap-2 flex-col"
          }`}
          >
            <div className="text-sm text-gray-500">{state.title}</div>
            <div
            className={`text-xl font-semibold  ${
              index !== 0 && "text-[30px] overflow-y-hidden"
            }`}

            >
              {state.value}
            </div>
            {
              state.change && (
                <div className={`text-sm ${
                  state.change.startsWith("+")
                  ?"text-green-500"
                  :"text-red-500"

                }`}>
                  {state.change} than last period
                </div>
              )
            }

          </div>
        )
      })
    }
  </div>
  </>;
};

export default Stats;
