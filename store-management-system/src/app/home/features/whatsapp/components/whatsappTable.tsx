"use client";
import Table from "@/components/table/table";
import { Edit, TrashIcon, Users, ExternalLink } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ToggleButton from "@/components/togglebutton";
import {
  whatsappService,
  WhatsappGroup,
} from "@/services/whatsapp.service";
import { useDispatch } from "react-redux";
import { SUCCESSALERT, ERRORALERT } from "@/store/slices/alert.slice";
import { openGlobalConfirm } from "@/store/slices/confirm.slice";

const WhatsappTable = ({ isDark = false }: { isDark?: boolean }) => {
  const [whatsappGroups, setWhatsappGroups] = useState<WhatsappGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const pathName = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const loadGroups = async () => {
    setLoading(true);
    try {
      const groups = await whatsappService.fetchGroups();
      setWhatsappGroups(groups);
    } catch (err) {
      console.warn("Failed to load WhatsApp groups:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleDeletePrompt = (data: any) => {
    const id = data._id || data.id;
    const name = data.groupName || data.name || "this WhatsApp Group";

    openGlobalConfirm(dispatch, {
      title: "Delete WhatsApp Group?",
      message: `Are you sure you want to permanently delete "${name}"? Active broadcasts will be stopped.`,
      confirmText: "Yes, Delete Group",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        try {
          await whatsappService.deleteGroup(id);
          dispatch(SUCCESSALERT(`Group "${name}" deleted successfully`));
          loadGroups();
        } catch {
          dispatch(ERRORALERT("Failed to delete WhatsApp group"));
        }
      },
    });
  };

  const handleUpdate = (data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("whatsappGroupData", JSON.stringify(data));
    }
    router.push(`${pathName}/update`);
  };

  const handleToggleStatus = async (row: any, newStatus: boolean) => {
    const id = row._id || row.id;
    try {
      await whatsappService.updateGroup(id, { status: newStatus });
      setWhatsappGroups((prev) =>
        prev.map((g) => (g._id === id || g.id === id ? { ...g, status: newStatus } : g)),
      );
      dispatch(
        SUCCESSALERT(`Group status updated to ${newStatus ? "Active" : "Inactive"}`),
      );
    } catch {
      dispatch(ERRORALERT("Failed to update status"));
    }
  };

  const columns = [
    {
      header: "Group Name",
      id: "GroupName",
      accessorKey: "groupName",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-green-500/15 text-green-400 font-bold border border-green-500/20">
            <Users size={16} />
          </div>
          <div>
            <p className="font-bold text-sm text-slate-100">{row.original.groupName}</p>
            <a
              href={row.original.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 mt-0.5"
            >
              <span>{row.original.url}</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      ),
    },
    {
      header: "Members",
      id: "Members",
      cell: ({ row }: { row: any }) => (
        <span className="text-xs font-semibold text-slate-300">
          {row.original.memberCount || 250}+ Active
        </span>
      ),
    },
    {
      header: "Status",
      id: "Status",
      cell: ({ row }: { row: any }) => (
        <div>
          <ToggleButton
            isDark={isDark}
            active={row.original.status}
            activeLabel="Active"
            inactiveLabel="Inactive"
            handler={(val: boolean) => handleToggleStatus(row.original, val)}
          />
        </div>
      ),
    },
    {
      header: "Actions",
      id: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleUpdate(row.original)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-colors cursor-pointer"
            title="Edit Group"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeletePrompt(row.original)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Delete Group"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      ),
    },
  ];

  type ColumnKey = "GroupName" | "Members" | "Status" | "Actions";
  const [columnVisibility, setColumnVisibility] = useState<
    Record<ColumnKey, boolean>
  >({
    GroupName: true,
    Members: true,
    Status: true,
    Actions: true,
  });

  return (
    <div className="w-[95%] mr-10 sm:ms-7">
      <Table
        columns={columns}
        data={whatsappGroups}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        isDark={isDark}
        isLoading={loading}
      />
    </div>
  );
};

export default WhatsappTable;
