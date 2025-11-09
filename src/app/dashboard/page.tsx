"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Table,
  Tag,
  Button,
  Pagination,
  Spin,
  DatePicker,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function Dashboard() {
  
  const router = useRouter();
  
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [weekStatuses, setWeekStatuses] = useState<Record<number, string>>({});
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // this function generate weeks list from jan 1 2024 and getting data
  const generateWeeks = useMemo(() => {
    const weeks = [];
    const start = new Date(2024, 0, 1);
    const today = new Date();
    const current = new Date(start);
    let weekCount = 1;

    // loop from 2024 01 01 till current data collect data and store in week array
    while (current <= today) {
      const day = current.getDay();
      const diffToMonday = (day === 0 ? -6 : 1) - day;
      const monday = new Date(current);
      monday.setDate(current.getDate() + diffToMonday);

      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);

      // use to format data string 
      // const formatDateRange = (startDate, endDate) => {
      //   const startDay = startDate.getDate();
      //   const endDay = endDate.getDate();
      //   const month = endDate.toLocaleString("default", { month: "long" });
      //   const year = endDate.getFullYear();
      //   return `${startDay}–${endDay} ${month} ${year}`;
      // };

      const formatDateRange = (startDate: string | Date, endDate: string | Date) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const startDay = start.getDate();
        const endDay = end.getDate();
        const month = end.toLocaleString("default", { month: "long" });

        return `${startDay}–${endDay} ${month}`;
      };

      weeks.push({
        key: weekCount,
        week: weekCount,
        monday,
        friday,
        date: formatDateRange(monday, friday),
      });

      current.setDate(current.getDate() + 7);
      weekCount++;
    }

    return weeks.reverse();
  }, []);

  
  useEffect(() => {
    const statuses: Record<number, string> = {};
    generateWeeks.forEach((week) => {
      const stored = sessionStorage.getItem(`week-${week.week}-tasks`);
      // check in session week data is present or not
      if (stored) {
        const tasks = JSON.parse(stored);

        // calculating total hours for week to add status for that week
        const totalHours = Object.values(tasks).flat().reduce((acc: number, task: any) => acc + (task.hours || 0), 0);

        if (totalHours === 0) statuses[week.week] = "Missing";
        else if (totalHours < 40) statuses[week.week] = "Incomplete";
        else statuses[week.week] = "Completed";
      } else {
        statuses[week.week] = "Missing";
      }
    });
    setWeekStatuses(statuses);
  }, [generateWeeks]);

  
  const filteredWeeks = useMemo(() => {
    return generateWeeks.filter((week) => {
      const status = weekStatuses[week.week] || "Missing";

      const matchStatus =
        !statusFilter || status.toLowerCase() === statusFilter.toLowerCase();

      const matchDate =
        !dateRange ||
        (dayjs(week.monday).isAfter(dateRange[0].startOf("day")) &&
          dayjs(week.friday).isBefore(dateRange[1].endOf("day")));

      return matchStatus && matchDate;
    });
  }, [generateWeeks, weekStatuses, statusFilter, dateRange]);

  // getting starting point on data
  const startIndex = (currentPage - 1) * pageSize;

  // based on start index and pagesize it will get only that particular data in week list table
  const currentData = filteredWeeks.slice(startIndex, startIndex + pageSize);

  // this is weeks listing columns start
  const columns = [
    {
    title: "Week",
    dataIndex: "week",
    key: "week",
    sorter: (a: { week: number }, b: { week: number }) => a.week - b.week,

    sortDirections: ["ascend", "descend"],
    onCell: () => ({
      style: {
        backgroundColor: "#f5f5f5", 
        fontWeight: 500,
        textAlign: "center",
      },
    }),
    },{ title: "Date Range", dataIndex: "date", key: "date",sorter: (a, b) => new Date(a.monday) - new Date(b.monday),sortDirections: ["ascend", "descend"] },
    {
      title: "Status",
      key: "status",
      sorter: (a, b) => {
        const statusA = (weekStatuses[a.week] || "Missing").toLowerCase();
        const statusB = (weekStatuses[b.week] || "Missing").toLowerCase();
      return statusA.localeCompare(statusB);
    },
    sortDirections: ["ascend", "descend"],
      render: (_, record) => {
        const status = weekStatuses[record.week] || "Missing";
        const color = status === "Completed" ? "green" : status === "Incomplete" ? "orange" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const status = weekStatuses[record.week] || "Missing";
        return (
          <Button type="default" size="small"
            onClick={() =>
              router.push(
                `/dashboard/week/${record.week}?range=${encodeURIComponent(
                  record.date
                )}`
              )
            }
          >
            {status === "Completed" ? "View" : status === "Incomplete" ? "Update": "Missing"}
          </Button>
        );
      },
    },
  ];

  // this is weeks listing columns start
  
  // this useEffect is use to check if status variable change then redirect to login page
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);


  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#F8F8F8]">
        <Spin size="large" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  
  return (
    <div className="min-h-screen bg-[#F8F8F8] p-4 sm:p-6">
      
      <div className="bg-white rounded-lg shadow-md p-6 w-full mx-auto">
        <h1 className="text-2xl font-bold mb-4">Your TimeSheets</h1>

        {/*  Filters Section start */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
          <Space className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <RangePicker onChange={(dates) => setDateRange(dates as any)} className="!w-full sm:!w-[250px]" />

            <Select placeholder="Status" allowClear onChange={(val) => setStatusFilter(val)} className="!w-full sm:!w-[200px]">
              <Option value="Missing">Missing</Option>
              <Option value="Incomplete">Incomplete</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Space>

          {(dateRange || statusFilter) && (
            <Button type="default" onClick={() => { setDateRange(null); setStatusFilter(null); }} >
              Clear Filters
            </Button>
          )}
        </div>

        {/*  Table */}
        <Table
          columns={columns}
          dataSource={currentData}
          pagination={false}
          bordered
          rowClassName="hover:bg-gray-50"
          scroll={{ x: 'max-content' }}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
          
          {/* Left side: Page size selector */}
          <Select
            value={pageSize}
            onChange={(value) => {
              setCurrentPage(1);
              setPageSize(value);
            }}
            style={{ width: 130 }}
            size="small"
          >
            <Option value={5}>5 per page</Option>
            <Option value={10}>10 per page</Option>
            <Option value={20}>20 per page</Option>
            <Option value={50}>50 per page</Option>
          </Select>

          {/* Right side: Pagination with rounded style */}
          <div className="bg-white border border-gray-200 rounded-full px-4 py-1 shadow-sm">
            <Pagination
              size="small"
              className="!space-x-0"
              current={currentPage}
              pageSize={pageSize}
              total={filteredWeeks.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              itemRender={(page, type, originalElement) => {
                if (type === "prev") {
                  return (
                    <Button type="link" size="small">
                      Previous
                    </Button>
                  );
                }
                if (type === "next") {
                  return (
                    <Button type="link" size="small">
                      Next
                    </Button>
                  );
                }
                return originalElement;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
