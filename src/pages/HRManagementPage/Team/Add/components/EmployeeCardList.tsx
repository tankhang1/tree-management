import {
  Card,
  Group,
  Stack,
  Text,
  Badge,
  Divider,
  Checkbox,
  LoadingOverlay,
  Avatar,
} from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import {
  useEmployeeStore,
  type Employee,
} from "../../../../zustand/employeeStore";

type TEmployeeCard = {
  isMultiple?: boolean;
  isTouchable?: boolean;
  selectedIds?: string[]; // Nhận từ cha
  onToggle?: (employee: Employee) => void; // Callback
  filterIds?: string[]; // (Optional) Chỉ hiện danh sách này
};

export function EmployeeCardList({
  isMultiple = true,
  isTouchable = true,
  selectedIds = [],
  onToggle,
  filterIds,
}: TEmployeeCard) {
  const { employees, isLoading } = useEmployeeStore();

  // Filter danh sách hiển thị nếu có props filterIds
  const displayEmployees = filterIds
    ? employees.filter((e) => filterIds.includes(e.id))
    : employees;

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
          {displayEmployees.length === 0 && !isLoading && (
            <Text c="dimmed" p="md">
              Chưa có nhân sự nào.
            </Text>
          )}

          {displayEmployees.map((emp) => {
            const isSelected = selectedIds.includes(emp.id);
            return (
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
                  borderColor: isSelected ? "green" : undefined,
                  borderWidth: isSelected ? 2 : 1,
                  cursor: isTouchable ? "pointer" : "default",
                }}
                onMouseEnter={(e) =>
                  isTouchable &&
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onClick={() => isTouchable && onToggle && onToggle(emp)}
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
                            checked={isSelected}
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
                      <b>Phòng ban:</b> {emp.departments?.join(", ") || "—"}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            );
          })}
        </Group>
      </Scrollable>
    </div>
  );
}
