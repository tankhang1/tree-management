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
import { useState, useEffect } from "react";
import { useDepartmentStore } from "../../../../zustand/departmentStore";

type DepartmentProps = {
  isCheckbox?: boolean;
  isMulti?: boolean;
  value?: string[]; // Danh sách ID đã chọn
  onChange?: (ids: string[]) => void;
};

export function DepartmentCardList({
  isCheckbox = true,
  isMulti = true,
  value = [],
  onChange,
}: DepartmentProps) {
  // 1. KẾT NỐI STORE
  const { departments, isLoading } = useDepartmentStore();

  // 2. STATE LOCAL
  const [selectedIds, setSelectedIds] = useState<string[]>(value);

  // 3. XỬ LÝ CHỌN
  const toggleSelection = (id: string) => {
    let newSelected: string[] = [];

    if (!isMulti) {
      // Chọn đơn: Click lại thì bỏ chọn, click mới thì thay thế
      newSelected = selectedIds.includes(id) ? [] : [id];
    } else {
      // Chọn nhiều: Toggle
      newSelected = selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id];
    }

    setSelectedIds(newSelected);
    onChange?.(newSelected);
  };

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

          {departments.map((dept) => (
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
                cursor: "pointer",
                borderColor: selectedIds.includes(dept.id)
                  ? "green"
                  : undefined,
                borderWidth: selectedIds.includes(dept.id) ? 2 : 1,
                backgroundColor: selectedIds.includes(dept.id)
                  ? "#f0fdf4"
                  : undefined,
              }}
              onClick={() => toggleSelection(dept.id)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
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
                        checked={selectedIds.includes(dept.id)}
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
                <Group justify="space-between" mt="xs">
                  <Text size="xs" c="dimmed">
                    Ngày tạo:{" "}
                    <Text span fw={500}>
                      {dept.createdAt}
                    </Text>
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))}
        </Group>
      </Scrollable>
    </div>
  );
}
