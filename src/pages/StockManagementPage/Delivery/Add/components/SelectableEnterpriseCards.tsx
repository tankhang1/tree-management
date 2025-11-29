import {
  Card,
  Checkbox,
  Group,
  Stack,
  Text,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import { useState, useEffect } from "react";
import Scrollable from "../../../../../components/Scrollable";
import { useCompanyStore } from "../../../../zustand/companyStore";

type TEnterprise = {
  isCheckbox?: boolean;
  isMulti?: boolean;
  value?: string[]; // Danh sách ID đã chọn từ cha
  onChange?: (ids: string[]) => void; // Hàm callback khi chọn
};

export function SelectableEnterpriseCards({
  isCheckbox = true,
  isMulti = true,
  value = [],
  onChange,
}: TEnterprise) {
  // 1. KẾT NỐI STORE
  const { companies, isLoading } = useCompanyStore();

  // 3. SYNC STATE VỚI PROP VALUE
  const [selectedIds, setSelectedIds] = useState<string[]>(value);

  useEffect(() => {
    setSelectedIds(value);
  }, [value]);

  // 4. XỬ LÝ CHỌN
  const toggleSelection = (id: string) => {
    let newSelected: string[] = [];

    if (!isMulti) {
      // Chế độ chọn 1: Nếu click lại cái đang chọn thì bỏ, không thì chọn cái mới
      newSelected = selectedIds.includes(id) ? [] : [id];
    } else {
      // Chế độ chọn nhiều
      newSelected = selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id];
    }

    setSelectedIds(newSelected);
    onChange?.(newSelected); // Báo cho component cha biết
  };

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay
        visible={isLoading}
        zIndex={10}
        overlayProps={{ radius: "sm", blur: 1 }}
      />

      <Scrollable h={280}>
        <Group wrap="nowrap" align="flex-start" gap={"md"} p={"xs"}>
          {/* Render Empty State nếu không có dữ liệu */}
          {companies.length === 0 && !isLoading && (
            <Text c="dimmed" p="md">
              Chưa có dữ liệu doanh nghiệp.
            </Text>
          )}

          {companies.map((e) => (
            <Card
              h={270}
              miw={350}
              key={e.id}
              withBorder
              radius={8}
              p="lg"
              style={{
                borderColor: selectedIds.includes(e.id) ? "#4caf50" : "#e0e0e0",
                borderWidth: selectedIds.includes(e.id) ? 2 : 1,
                position: "relative",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(ev) => {
                ev.currentTarget.style.transform = "scale(1.03)";
                ev.currentTarget.style.boxShadow =
                  "0 6px 12px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(ev) => {
                ev.currentTarget.style.transform = "scale(1)";
                ev.currentTarget.style.boxShadow = selectedIds.includes(e.id)
                  ? "0 4px 8px rgba(76, 175, 80, 0.4)"
                  : "0 2px 4px rgba(0, 0, 0, 0.1)";
              }}
              onClick={() => toggleSelection(e.id)}
            >
              <Group justify="space-between">
                <Title order={5} style={{ color: "#333", fontWeight: 600 }}>
                  {e.name}
                </Title>
                {isCheckbox && (
                  <Checkbox
                    checked={selectedIds.includes(e.id)}
                    readOnly
                    onChange={() => {}}
                    tabIndex={-1}
                    style={{ cursor: "pointer" }}
                    color="green"
                  />
                )}
              </Group>
              <Stack gap={6} mt="sm">
                <Text size="sm" style={{ color: "#555" }}>
                  <strong>Loại hình:</strong> {e.type}
                </Text>
                <Text size="sm" style={{ color: "#555" }}>
                  {/* Map representative thành Chủ sở hữu để khớp UI cũ */}
                  <strong>Chủ sở hữu:</strong> {e.representative}
                </Text>
                <Text size="sm" style={{ color: "#555" }}>
                  {/* Map taxCode hoặc code */}
                  <strong>Mã số/CCCD:</strong> {e.taxCode || e.code}
                </Text>
                <Text size="sm" style={{ color: "#555" }}>
                  <strong>Số điện thoại:</strong> {e.phone}
                </Text>
                <Text size="sm" style={{ color: "#555" }}>
                  <strong>Email:</strong> {e.email}
                </Text>
                <Text
                  size="sm"
                  style={{ color: "#555" }}
                  lineClamp={1}
                  title={e.address}
                >
                  <strong>Địa chỉ:</strong> {e.address}
                </Text>
                {e.taxCode && (
                  <Text size="sm" style={{ color: "#555" }}>
                    <strong>Mã số thuế:</strong> {e.taxCode}
                  </Text>
                )}
              </Stack>
            </Card>
          ))}
        </Group>
      </Scrollable>
    </div>
  );
}
