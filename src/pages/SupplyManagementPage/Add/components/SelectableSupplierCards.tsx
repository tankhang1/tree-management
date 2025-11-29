import {
  Card,
  Text,
  Badge,
  Stack,
  Group,
  Checkbox,
  LoadingOverlay,
} from "@mantine/core";
import { useState, useEffect, useMemo } from "react";
import Scrollable from "../../../../components/Scrollable";
import { useCompanyStore } from "../../../zustand/companyStore";

type TSelectableSupplierCards = {
  isCheckbox?: boolean;
  isMultiple?: boolean;
  value?: string[]; // Danh sách ID đã chọn
  onChange?: (ids: string[]) => void; // Callback khi chọn
};

export function SelectableSupplierCards({
  isCheckbox,
  isMultiple = true,
  value = [],
  onChange,
}: TSelectableSupplierCards) {
  // 1. Kết nối Store Company
  const { companies, isLoading } = useCompanyStore();

  // 2. State local đồng bộ với props
  const [selectedIds, setSelectedIds] = useState<string[]>(value);

  useEffect(() => {
    setSelectedIds(value);
  }, [value]);

  // 3. Lọc chỉ lấy các công ty là Nhà cung cấp (supplier)
  const suppliers = useMemo(
    () => companies.filter((c) => c.categoryType === "supplier"),
    [companies]
  );

  const toggleSelection = (id: string) => {
    let newSelection: string[] = [];
    if (!isMultiple) {
      // Chọn đơn: Nếu chọn lại cái cũ thì bỏ, ngược lại lấy cái mới
      newSelection = selectedIds.includes(id) ? [] : [id];
    } else {
      // Chọn đa: Toggle
      newSelection = selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id];
    }
    setSelectedIds(newSelection);
    onChange?.(newSelection);
  };

  return (
    <Card withBorder radius="md" p={0} pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Scrollable h={290}>
        <Group wrap="nowrap" gap="md" p={"xs"}>
          {suppliers.length === 0 && !isLoading && (
            <Text c="dimmed" p="md" size="sm">
              Chưa có dữ liệu nhà cung cấp.
            </Text>
          )}

          {suppliers.map((s) => (
            <Card
              key={s.id}
              withBorder
              radius="md"
              miw={400}
              h={270}
              p="md"
              onClick={() => toggleSelection(s.id)}
              style={{
                cursor: "pointer",
                borderColor: selectedIds.includes(s.id) ? "green" : undefined,
                borderWidth: selectedIds.includes(s.id) ? 2 : 1,
              }}
            >
              <Group justify="space-between" mb="xs">
                <Text fw={600} lineClamp={1} title={s.name}>
                  {s.name}
                </Text>
                {isCheckbox && (
                  <Checkbox
                    checked={selectedIds.includes(s.id)}
                    readOnly
                    tabIndex={-1}
                    color="green"
                    style={{ pointerEvents: "none" }}
                  />
                )}
              </Group>
              <Stack gap={2}>
                <Text size="sm">
                  <strong>Loại:</strong> {s.type}
                </Text>
                <Text size="sm">
                  <strong>Đại diện:</strong> {s.representative}
                </Text>
                <Text size="sm">
                  <strong>SĐT:</strong> {s.phone}
                </Text>
                <Text size="sm" lineClamp={1}>
                  <strong>ĐC:</strong> {s.address}
                </Text>
                <Text size="sm">
                  <strong>MST:</strong> {s.taxCode || "—"}
                </Text>
                <Group gap={4} mt={4}>
                  <Badge variant="light" color="blue">
                    {s.category}
                  </Badge>
                </Group>
              </Stack>
            </Card>
          ))}
        </Group>
      </Scrollable>
    </Card>
  );
}
