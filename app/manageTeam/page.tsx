"use client";

import Button from "@/components/Button";
import Panel from "@/components/Panel";
import Input from "@/components/inputGroup/Input";
import { errorHandler } from "@/helpers/errorHandler";
import useClientSession from "@/hooks/use-client-session";
import { GroupProps, TeamProps } from "@/types/outputProps";
import {
  createTeamGroupSchema,
  editTeamGroupSchema,
} from "@/types/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Collapse, CollapseProps, Dropdown, Empty, Modal, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { z } from "zod";
import { FaCog } from "react-icons/fa";
import { MdAddBox, MdEdit, MdDelete } from "react-icons/md";
import $ from "jquery";
import { IoIosAddCircle } from "react-icons/io";

type EditForm = z.infer<typeof editTeamGroupSchema>;
type CreateForm = z.infer<typeof createTeamGroupSchema>;

const ManageTeamPage = () => {
  const [teams, setTeams] = useState<TeamProps[]>([]);
  const [groups, setGroups] = useState<GroupProps[]>([]);
  const [target, setTarget] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [createModalopen, setCreateModalOpen] = useState(false);
  const [editModalopen, setEditModalOpen] = useState(false);
  const [editGroupId, setEditGroupId] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamProps | null>(null);
  const session = useClientSession();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<EditForm>({
    resolver: zodResolver(editTeamGroupSchema),
  });
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    clearErrors: clearErrors2,
    formState: { errors: errors2 },
  } = useForm<CreateForm>({
    resolver: zodResolver(createTeamGroupSchema),
  });

  const getCollapseData = async () => {
    setLoading(true);
    try {
      const { data: teams } = await axios.get("/api/common/team");
      const { data: groups } = await axios.get("/api/common/group");
      setTeams(teams);
      setGroups(groups);
    } catch (err: any) {
      errorHandler(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCollapseData();
  }, []);

  const onClickSetting = (e: any, team: TeamProps) => {
    e.stopPropagation();
    e.preventDefault();
    setTarget("team");
    setSelectedTeam(team);
  };

  // team action
  // add
  const onCreateTeam = (e: any) => {
    setTarget("team");
    setCreateModalOpen(true);
    setEditModalOpen(false);
  };

  const onCreateTeamSubmit = handleSubmit2(async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/common/team", data, {
        headers: {
          "user-id": session?.user.id,
        },
      });
      if (res.status === 201) {
        toast.success("เพิ่มศูนย์/กองสำเร็จ");
        getCollapseData();
      }
    } catch (err: any) {
      errorHandler(err);
    }
    setLoading(false);
    onCreateActions();
  });

  // edit
  const onEditTeam = (e: any) => {
    e.stopPropagation();
    if (selectedTeam) {
      setTarget("team");
      setEditModalOpen(true);
      setCreateModalOpen(false);
      setValue("label", selectedTeam.label);
      setValue("abb", selectedTeam.abb);
    }
  };

  const onEditTeamSubmit = handleSubmit(async (data) => {
    if (selectedTeam) {
      try {
        setLoading(true);
        const res = await axios.patch(
          `/api/common/team/${selectedTeam.id}`,
          data,
          {
            headers: {
              "user-id": session?.user.id,
            },
          }
        );
        if (res.status === 200) {
          toast.success("แก้ไขศูนย์/กองสำเร็จ");
          getCollapseData();
        }
      } catch (err: any) {
        errorHandler(err);
      }
    }
    setLoading(false);
    onEditActions();
  });

  // delete
  const onDeleteTeam = (e: any) => {
    e.stopPropagation();
    if (selectedTeam) {
      Swal.fire({
        title: "คำเตือน",
        text: `คุณต้องการลบ ${selectedTeam.label} และกลุ่มทุกกลุ่มที่อยู่ข้างในใช่หรือไม่`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "ไม่",
        confirmButtonText: "ใช่",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteTeam(selectedTeam.id);
        }
      });
    }
  };

  const deleteTeam = async (id: number) => {
    try {
      setLoading(true);
      const res = await axios.delete(`/api/common/team/${id}`, {
        headers: {
          "user-id": session?.user.id,
        },
      });
      if (res.status === 200) {
        toast.success("ลบศูนย์/กองสำเร็จ");
        getCollapseData();
      }
    } catch (err: any) {
      errorHandler(err);
    }
    setLoading(false);
  };

  // group action
  // add
  const onAddGroup = (e: any) => {
    e.stopPropagation();
    setTarget("group");
    setCreateModalOpen(true);
    setEditModalOpen(false);
  };

  const onCreateGroupSubmit = handleSubmit2(async (data) => {
    if (selectedTeam) {
      data.teamId = selectedTeam.id;
      try {
        setLoading(true);
        const res = await axios.post("/api/common/group", data, {
          headers: {
            "user-id": session?.user.id,
          },
        });
        if (res.status === 201) {
          toast.success("เพิ่มกลุ่มสำเร็จ");
          getCollapseData();
        }
      } catch (err: any) {
        errorHandler(err);
      }
    }
    setLoading(false);
    onCreateActions();
  });

  // edit
  const onEditGroup = (data: GroupProps) => {
    setTarget("group");
    setEditModalOpen(true);
    setCreateModalOpen(false);
    setEditGroupId(data.id);
    setValue("label", data.label);
  };

  const onEditGroupSubmit = handleSubmit(async (data) => {
    if (editGroupId) {
      try {
        setLoading(true);
        const res = await axios.patch(
          `/api/common/group/${editGroupId}`,
          data,
          {
            headers: {
              "user-id": session?.user.id,
            },
          }
        );
        if (res.status === 200) {
          toast.success("แก้ไขกลุ่มสำเร็จ");
          getCollapseData();
        }
      } catch (err: any) {
        errorHandler(err);
      }
    }
    setLoading(false);
    onEditActions();
  });

  // delete
  const onDeleteGroup = (data: GroupProps) => {
    Swal.fire({
      title: "คำเตือน",
      text: `คุณต้องการลบ ${data.label} ใช่หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ไม่",
      confirmButtonText: "ใช่",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteGroup(data.id);
      }
    });
  };

  const deleteGroup = async (id: number) => {
    try {
      setLoading(true);
      const res = await axios.delete(`/api/common/group/${id}`, {
        headers: {
          "user-id": session?.user.id,
        },
      });
      if (res.status === 200) {
        toast.success("ลบกลุ่มสำเร็จ");
        getCollapseData();
      }
    } catch (err: any) {
      errorHandler(err);
    }
    setLoading(false);
  };

  // both group and team
  // create
  const onCreateActions = () => {
    setCreateModalOpen(false);
    clearErrors2();
    reset2();
  };

  // edit
  const onEditActions = () => {
    setEditModalOpen(false);
    clearErrors();
    reset();
  };

  let items = [
    {
      key: "1",
      label: (
        <div onClick={(e) => onAddGroup(e)} className="flex items-center gap-3">
          <MdAddBox />
          เพิ่มกลุ่มงาน
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div onClick={(e) => onEditTeam(e)} className="flex items-center gap-3">
          <MdEdit />
          แก้ไขศูนย์/กอง
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div
          onClick={(e) => onDeleteTeam(e)}
          className="flex items-center gap-3"
        >
          <MdDelete />
          ลบศูนย์/กอง
        </div>
      ),
    },
  ];

  const genExtra = (team: TeamProps) => (
    <div className="flex items-center gap-2">
      <Dropdown
        menu={{
          items,
        }}
        trigger={["click"]}
      >
        <a onClick={(e) => onClickSetting(e, team)}>
          <FaCog />
        </a>
      </Dropdown>
    </div>
  );

  const onChange = (key: string | string[]) => {};

  const collapseTeams: CollapseProps["items"] = [];
  teams.forEach((team, i) => {
    const filteredGroups = groups.filter((group) => group.teamId === team.id);
    collapseTeams.push({
      key: i,
      label: `${team.label} ${team.abb && `(${team.abb})`}`,
      children: (
        <>
          {filteredGroups.length > 0 ? (
            <div className="border rounded-md">
              {filteredGroups.map((group) => (
                <Panel
                  key={group.id}
                  data={group}
                  onEdit={onEditGroup}
                  onDelete={onDeleteGroup}
                >
                  {group.label}
                </Panel>
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </>
      ),
      extra: genExtra(team),
    });
  });

  let targetText = "";
  if (target === "team") {
    targetText = "ศูนย์/กอง";
  } else {
    targetText = "กลุ่ม";
  }

  return (
    <>
      <h1 className="text-3xl">จัดการศูนย์/กอง</h1>
      <div className="card">
        <div className="flex justify-end mb-2">
          <p
            className="flex items-center gap-1 cursor-pointer hover:text-black"
            onClick={onCreateTeam}
          >
            <IoIosAddCircle className="text-xl" />
            เพิ่มศูนย์/กอง
          </p>
        </div>
        {loading ? (
          <Spin size="large" className="flex justify-center" />
        ) : (
          <Collapse onChange={onChange} items={collapseTeams} />
        )}
      </div>
      <Modal
        title={<p className="text-center text-xl">แก้ไข{targetText}</p>}
        open={editModalopen}
        onCancel={onEditActions}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <form
          onSubmit={target === "team" ? onEditTeamSubmit : onEditGroupSubmit}
          className="flex flex-wrap flex-col gap-x-5 gap-y-5 items-center justify-center mt-10"
        >
          <Input
            name="label"
            placeholder={targetText}
            register={register}
            errors={errors.label}
            className="w-60 md:w-72"
          />
          {target === "team" && (
            <Input
              name="abb"
              placeholder="ตัวย่อ"
              register={register}
              errors={errors.abb}
              className="w-60 md:w-72"
            />
          )}
          <div className="w-full text-center">
            <Button
              type="submit"
              warning
              className="!mx-auto w-60 md:w-72"
              loading={loading}
            >
              แก้ไข
            </Button>
            <span
              className="text-gray-500 cursor-pointer hover:text-black"
              onClick={() => reset()}
            >
              ล้างข้อมูล
            </span>
          </div>
        </form>
      </Modal>
      <Modal
        title={
          <p className="text-center text-xl">
            เพิ่ม{targetText}
            {target === "group" && `ใน${selectedTeam?.label}`}
          </p>
        }
        open={createModalopen}
        onCancel={onCreateActions}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <form
          onSubmit={
            target === "team" ? onCreateTeamSubmit : onCreateGroupSubmit
          }
          className="flex flex-wrap flex-col gap-x-5 gap-y-5 items-center justify-center mt-10"
        >
          <Input
            name="label"
            placeholder={targetText}
            register={register2}
            errors={errors2.label}
            className="w-60 md:w-72"
          />
          {target === "team" && (
            <Input
              name="abb"
              placeholder="ตัวย่อ"
              register={register2}
              errors={errors2.abb}
              className="w-60 md:w-72"
            />
          )}
          <div className="w-full text-center">
            <Button
              type="submit"
              primary
              className="!mx-auto w-60 md:w-72"
              loading={loading}
            >
              เพิ่ม
            </Button>
            <span
              className="text-gray-500 cursor-pointer hover:text-black"
              onClick={() => reset2()}
            >
              ล้างข้อมูล
            </span>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ManageTeamPage;
