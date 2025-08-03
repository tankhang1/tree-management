import { Card, Text, Badge, Stack, Group, Checkbox } from "@mantine/core";
import { useState } from "react";
import { suppliersData } from "../../../../SupplyManagementPage/Add/components/SelectableSupplierCards";
import Scrollable from "../../../../../components/Scrollable";

type TSelectableSupplierCards = {
  isCheckbox?: boolean;
  isMultiple?: boolean;
};
export function SelectableSupplierCards({
  isCheckbox,
  isMultiple = true,
}: TSelectableSupplierCards) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    if (!isMultiple) {
      setSelectedIds([id]);
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <Scrollable h={280}>
      <Group wrap="nowrap" align="flex-start" p={"xs"} gap={"md"}>
        {suppliersData.map((s) => (
          <Card
            key={s.id}
            withBorder
            radius={4}
            p="md"
            miw={350}
            h={260}
            onClick={() => toggleSelection(s.id)}
            style={{
              cursor: "pointer",
              borderColor: selectedIds.includes(s.id) ? "green" : undefined,
              position: "relative",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Group justify="space-between" mb="xs">
              <Text fw={600}>{s.name}</Text>
              {isCheckbox && (
                <Checkbox
                  checked={selectedIds.includes(s.id)}
                  readOnly
                  tabIndex={-1}
                />
              )}
            </Group>
            <Stack gap={2}>
              <Text size="sm">
                <strong>Loại:</strong> {s.type}
              </Text>
              <Text size="sm">
                <strong>Người đại diện:</strong> {s.representative}
              </Text>
              <Text size="sm">
                <strong>SĐT:</strong> {s.phone}
              </Text>
              {s.email && (
                <Text size="sm">
                  <strong>Email:</strong> {s.email}
                </Text>
              )}
              <Text size="sm">
                <strong>Địa chỉ:</strong> {s.address}
              </Text>
              {s.taxCode && (
                <Text size="sm">
                  <strong>Mã số thuế:</strong> {s.taxCode}
                </Text>
              )}
              <Text size="sm">
                <strong>Ngành hàng:</strong>{" "}
                <Group gap={4}>
                  {s.sectors.map((sec) => (
                    <Badge key={sec} variant="light" color="green">
                      {sec}
                    </Badge>
                  ))}
                </Group>
              </Text>
              {s.note && (
                <Text size="sm" c="dimmed">
                  💬 {s.note}
                </Text>
              )}
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
}
