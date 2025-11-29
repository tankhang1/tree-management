import {
  Card,
  Group,
  Stack,
  Text,
  Badge,
  Divider,
  Tooltip,
  Checkbox,
  ActionIcon,
  LoadingOverlay,
  Avatar,
} from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import { useState, useEffect } from "react";
import { IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useEmployeeStore } from "../../../../zustand/employeeStore";

type TEmployeeCard = {
  isDelete?: boolean;
  isMultiple?: boolean;
  isTouchable?: boolean;
  value?: string[]; // Danh sách ID đã chọn
  onChange?: (ids: string[]) => void; // Callback khi chọn
};

export function EmployeeCardList({
  isDelete = false,
  isMultiple = true,
  isTouchable = true,
  value = [],
  onChange,
}: TEmployeeCard) {
  // 1. KẾT NỐI STORE
  const { employees, deleteEmployee, isLoading } = useEmployeeStore();

  // 2. STATE LOCAL
  const [selectedIds, setSelectedIds] = useState<string[]>(value);

  // 3. HANDLERS
  const onSelect = (id: string) => {
    if (!isTouchable) return;

    let newSelected: string[] = [];
    if (isMultiple) {
      newSelected = selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id];
    } else {
      newSelected = selectedIds.includes(id) ? [] : [id];
    }

    setSelectedIds(newSelected);
    onChange?.(newSelected);
  };

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra Card (gây chọn nhầm)
    if (confirm(`Bạn có chắc chắn muốn xóa nhân sự ${name}?`)) {
      deleteEmployee(id);
      notifications.show({
        title: "Đã xóa",
        message: `Đã xóa ${name}`,
        color: "green",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "probation":
        return "yellow";
      case "inactive":
        return "gray";
      default:
        return "blue";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Đang hoạt động";
      case "probation":
        return "Thử việc";
      case "inactive":
        return "Nghỉ việc";
      default:
        return status;
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay
        visible={isLoading}
        zIndex={10}
        overlayProps={{ radius: "sm", blur: 1 }}
      />

      <Scrollable h={220}>
        <Group gap="lg" align="flex-start" wrap="nowrap" p="xs">
          {employees.length === 0 && !isLoading && (
            <Text c="dimmed" p="md">
              Chưa có nhân sự nào.
            </Text>
          )}

          {employees.map((emp) => (
            <Card
              key={emp.id}
              withBorder
              radius={4}
              shadow="sm"
              p="md"
              miw={460}
              style={{
                position: "relative",
                transition: "transform 0.2s ease",
                borderColor: selectedIds.includes(emp.id) ? "green" : undefined,
                borderWidth: selectedIds.includes(emp.id) ? 2 : 1,
                cursor: isTouchable ? "pointer" : "default",
              }}
              onMouseEnter={(e) =>
                isTouchable && (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onClick={() => onSelect(emp.id)}
            >
              <Group align="flex-start" gap="md">
                <Avatar
                  src={emp.avatarUrl}
                  h={160}
                  w={100}
                  radius={4}
                  color="blue"
                  variant="filled"
                >
                  {emp.fullName.charAt(0)}
                </Avatar>

                <Stack gap={4} style={{ flex: 1 }}>
                  <Group justify="space-between">
                    <Text fw={600} size="lg">
                      {emp.fullName}
                    </Text>
                    <Group gap={"xs"}>
                      <Badge color={getStatusColor(emp.status)}>
                        {getStatusLabel(emp.status)}
                      </Badge>
                      {isMultiple && isTouchable && (
                        <Checkbox
                          radius={4}
                          checked={selectedIds.includes(emp.id)}
                          readOnly
                          color="green"
                          tabIndex={-1}
                          style={{ pointerEvents: "none" }}
                        />
                      )}
                    </Group>
                  </Group>
                  <Divider my="xs" />
                  <Text size="sm" c="dimmed">
                    <b>Vai trò:</b> {emp.role}
                  </Text>
                  <Text size="sm" c="dimmed">
                    <b>Cấp bậc:</b> {emp.level}
                  </Text>
                  <Text size="sm" c="dimmed">
                    <b>Phòng ban:</b> {emp.departments?.join(", ") || "—"}
                  </Text>
                  <Text size="sm" c="dimmed">
                    <b>Người quản lý:</b> {emp.manager || "—"}
                  </Text>
                </Stack>
              </Group>

              {isDelete && (
                <Tooltip label="Xóa nhân sự" position="top" withArrow>
                  <ActionIcon
                    pos="absolute"
                    variant="light"
                    color="red"
                    right={16}
                    bottom={16}
                    radius={4}
                    onClick={(e) => handleDelete(e, emp.id, emp.fullName)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Card>
          ))}
        </Group>
      </Scrollable>
    </div>
  );
}
