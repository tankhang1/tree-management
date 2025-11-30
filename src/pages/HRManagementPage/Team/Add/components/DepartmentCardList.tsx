import {
  Card,
  Stack,
  Text,
  Group,
  Badge,
  Title,
  Checkbox,
  LoadingOverlay,
} from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import {
  useDepartmentStore,
  type Department,
} from "../../../../zustand/departmentStore";

type DepartmentProps = {
  isCheckbox?: boolean;
  selectedIds?: string[]; // Nhận danh sách ID từ cha
  onToggle?: (department: Department) => void; // Hàm callback
  readonly?: boolean; // Chế độ chỉ xem (cho bước xác nhận)
};

export function DepartmentCardList({
  isCheckbox = true,
  selectedIds = [],
  onToggle,
  readonly = false,
}: DepartmentProps) {
  const { departments, isLoading } = useDepartmentStore();

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay
        visible={isLoading}
        zIndex={10}
        overlayProps={{ radius: "sm", blur: 1 }}
      />

      <Scrollable h={160}>
        <Group wrap="nowrap" gap={"md"} p={"xs"}>
          {departments.length === 0 && !isLoading && (
            <Text c="dimmed" size="sm">
              Chưa có phòng ban nào.
            </Text>
          )}

          {departments.map((dept) => {
            const isSelected = selectedIds.includes(dept.id);
            // Nếu readonly = true, chỉ hiện những item được chọn (hoặc tất cả nhưng ko click đc - tùy bạn)
            // Ở đây tôi giả định readonly dùng cho bước xác nhận -> Chỉ hiện cái đã chọn
            if (readonly && !isSelected) return null;

            return (
              <Card
                h={140}
                miw={300}
                key={dept.id}
                withBorder
                radius={4}
                shadow="xs"
                p="md"
                style={{
                  position: "relative",
                  transition: "all 0.2s ease",
                  cursor: readonly ? "default" : "pointer",
                  borderColor: isSelected ? "green" : undefined,
                  borderWidth: isSelected ? 2 : 1,
                  backgroundColor: isSelected ? "#f0fdf4" : undefined,
                }}
                onClick={() => !readonly && onToggle && onToggle(dept)}
              >
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Title order={5} lineClamp={1} title={dept.name}>
                      {dept.name}
                    </Title>
                    <Group gap={"xs"}>
                      <Badge variant="light" color="gray">
                        {dept.code}
                      </Badge>
                      {isCheckbox && (
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
                  <Text
                    size="sm"
                    c="dimmed"
                    lineClamp={2}
                    title={dept.description}
                  >
                    {dept.description || "Không có mô tả"}
                  </Text>
                </Stack>
              </Card>
            );
          })}
        </Group>
      </Scrollable>
    </div>
  );
}
