"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Dropdown,
  Menu,
  Progress,
  Tooltip,
} from "antd";
import {
  EllipsisOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { useParams, useSearchParams } from "next/navigation";
import "./WeekPage.css";
import TaskModal from "./TaskModal";

const { Option } = Select;

export default function WeekPage() {
  const { week } = useParams();

  const searchParams = useSearchParams();
  const dateRange = searchParams.get("range") || "1–5 January 2025";

  const [days, setDays] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Record<string, any[]>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [form] = Form.useForm();
  const [hours, setHours] = useState(1);

  // function for getting dates in week get week days from URL 
  const getDateListFromRange = (range: string) => {
    const match = range.match(/(\d+)[–-](\d+)\s+([A-Za-z]+)\s+(\d{4})/);
    if (!match) return [];
    const [, startDay, endDay, monthName, year] = match;
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
    const yearNum = parseInt(year, 10);
    const start = parseInt(startDay, 10);
    const end = parseInt(endDay, 10);
    const days: string[] = [];
    for (let day = start; day <= end; day++) {
      const date = new Date(yearNum, monthIndex, day);
      days.push(
        date.toLocaleDateString("en-US", { day: "numeric", month: "short" })
      );
    }
    return days;
  };

  // check current week has already data if has setTask
  useEffect(() => {
    const parsedDays = getDateListFromRange(dateRange);
    setDays(parsedDays);
    const stored = sessionStorage.getItem(`week-${week}-tasks`);
    if (stored) setTasks(JSON.parse(stored));
  }, [dateRange, week]);

  
  useEffect(() => {
    if (Object.keys(tasks).length > 0)
      sessionStorage.setItem(`week-${week}-tasks`, JSON.stringify(tasks));
  }, [tasks, week]);

  
  // geting data from modal for add and edit
  const handleAddOrEditTask = (values: any) => {
    
    const { project, type, description } = values;
    const newTask = {
      id: editingTask ? editingTask.id : Date.now(),
      project,
      type,
      description,
      hours: parseFloat(hours),
    };

    setTasks((prev) => {
      const dayTasks = prev[selectedDay] || [];
      const updatedDayTasks = editingTask
        ? dayTasks.map((t) => (t.id === editingTask.id ? newTask : t))
        : [...dayTasks, newTask];
      return { ...prev, [selectedDay]: updatedDayTasks };
    });

    form.resetFields();
    setHours(0);
    setModalVisible(false);
    setEditingTask(null);
  };

  // delete particular task in day
  const handleDeleteTask = (day: string, id: number) => {
    setTasks((prev) => ({
      ...prev,
      [day]: prev[day].filter((t) => t.id !== id),
    }));
  };

  const totalHours = Object.values(tasks)
    .flat()
    .reduce((acc, task: any) => acc + task.hours, 0);

  const status = totalHours === 40 ? "completed" : totalHours === 0 ? "missing" : "incomplete";

  const statusColor = status === "completed" ? "green" : status === "incomplete" ? "orange" : "red";

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center px-4 sm:px-6 py-6">
      
      <div className="bg-white shadow-md rounded-lg w-full max-w-[1232px] p-4 sm:p-8">
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900"> This Week’s Timesheet </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1"> {dateRange} </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-[188px]">
            <Tooltip title={`${totalHours} / 40 hrs`} placement="top">
              <Progress
                percent={Math.min((totalHours / 40) * 100, 100)}
                showInfo={false}
                strokeColor={ status === "completed" ? "#52c41a" : status === "incomplete" ? "#faad14" : "#f5222d"}
                className="!w-[100px] sm:!w-[120px]"
              />
            </Tooltip>
            <span
              className={`text-sm font-medium ${status === "completed" ? "text-green-600" : status === "incomplete" ? "text-orange-500" : "text-red-500"}`} >
              {Math.min(((totalHours / 40) * 100).toFixed(0), 100)}%
            </span>
          </div>
        </div>

        
        <div className="flex flex-col gap-5 mt-6">
          
          {/* days loop start */}
          {days.map((day) => (
            <div key={day} className="day-row flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-8  bg-white rounded-xl p-3 sm:p-4" >
              
              <div className="sm:w-[120px] flex-shrink-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {day}
                </h3>
              </div>

              
              <div className="flex flex-col flex-1 gap-3 w-full">
                
                {/* task in days loop start */}
                {(tasks[day] || []).map((task) => (
                  <div
                    key={task.id}
                    className="task-card flex flex-col sm:flex-row sm:justify-between sm:items-center border border-gray-300 rounded-lg p-3 bg-white gap-3 w-full"
                  >
                    <div
                      className="font-inter font-medium text-[16px] leading-[150%] tracking-[0%] text-gray-900 w-[428px] h-[24px] opacity-100 text-sm sm:text-base" >
                      {task.type}
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                      <p className="text-gray-400 text-sm">{task.hours} hrs</p>
                      <Tag color="blue" className="text-xs sm:text-sm">
                        {task.project}
                      </Tag>
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item onClick={() => { setEditingTask(task); setSelectedDay(day); setModalVisible(true); form.setFieldsValue(task);}} > Edit </Menu.Item>
                            <Menu.Item danger onClick={() => handleDeleteTask(day, task.id)}>Delete </Menu.Item>
                          </Menu>
                        }
                        trigger={["click"]}
                      >
                        <Button
                          type="text"
                          icon={<EllipsisOutlined />}
                          className="text-gray-500 hover:text-gray-700"
                        />
                      </Dropdown>
                    </div>
                  </div>
                ))}
                {/* task in days loop start */}
                
                {/* add task button */}
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  className="add-task-btn border-gray-400 text-gray-600 w-full"
                  onClick={() => {
                    setSelectedDay(day);
                    setEditingTask(null);
                    setModalVisible(true);
                    form.resetFields();
                  }}
                >Add Task</Button>
                {/* add task button */}

              </div>
            </div>
          ))}
          {/* days loops ends */}
        </div>
      </div>

      <TaskModal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onFinish={handleAddOrEditTask}
        form={form}
        editingTask={editingTask}
        hours={hours}
        setHours={setHours}
      />
    </div>
  );
}
