import {
  Card,
  Stack,
  Text,
  Group,
  Badge,
  Title,
  Checkbox,
} from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import { useState } from "react";

const departments = [
  {
    code: "PB-KT",
    name: "Phòng Kỹ thuật",
    description: "Phụ trách kỹ thuật canh tác và máy móc",
    createdAt: "2024-06-01",
    updatedAt: "2025-01-15",
  },
  {
    code: "PB-NC",
    name: "Phòng Nghiên cứu",
    description: "Nghiên cứu giống cây trồng và phân tích đất",
    createdAt: "2024-06-10",
    updatedAt: "2025-03-10",
  },
  {
    code: "PB-TCHC",
    name: "Phòng Tổ chức Hành chính",
    description: "Quản lý nhân sự, hành chính",
    createdAt: "2024-07-01",
    updatedAt: "2025-04-22",
  },
  {
    code: "PB-KD",
    name: "Phòng Kinh doanh",
    description: "Lập kế hoạch tiêu thụ sản phẩm, tìm kiếm thị trường",
    createdAt: "2024-05-15",
    updatedAt: "2025-02-10",
  },
  {
    code: "PB-TC",
    name: "Phòng Tài chính",
    description: "Quản lý thu chi, kế toán, báo cáo tài chính",
    createdAt: "2024-04-20",
    updatedAt: "2025-01-30",
  },
  {
    code: "PB-CL",
    name: "Phòng Quản lý Chất lượng",
    description: "Đảm bảo chất lượng nông sản, kiểm định quy trình",
    createdAt: "2024-06-25",
    updatedAt: "2025-03-18",
  },
  {
    code: "PB-KH",
    name: "Phòng Kế hoạch",
    description: "Lập kế hoạch mùa vụ, phân bổ tài nguyên và nhân lực",
    createdAt: "2024-05-01",
    updatedAt: "2025-02-25",
  },
  {
    code: "PB-VT",
    name: "Phòng Vật tư",
    description: "Quản lý kho vật tư nông nghiệp, cấp phát thiết bị",
    createdAt: "2024-06-05",
    updatedAt: "2025-04-01",
  },
  {
    code: "PB-CNTT",
    name: "Phòng Công nghệ Thông tin",
    description: "Xây dựng, bảo trì hệ thống phần mềm, hạ tầng công nghệ",
    createdAt: "2024-08-01",
    updatedAt: "2025-05-10",
  },
  {
    code: "PB-HTKH",
    name: "Phòng Hợp tác & Khoa học",
    description: "Hợp tác với các viện nghiên cứu và chuyển giao công nghệ",
    createdAt: "2024-07-20",
    updatedAt: "2025-03-30",
  },
];

type DepartmentProps = {
  isCheckbox?: boolean;
};
export function DepartmentCardList({ isCheckbox = true }: DepartmentProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (code: string) => {
    setSelectedIds((prev) =>
      prev.includes(code) ? prev.filter((s) => s !== code) : [...prev, code]
    );
  };
  return (
    <Scrollable h={150}>
      <Group wrap="nowrap" gap={"md"} p={"xs"}>
        {departments.map((dept) => (
          <Card
            h={130}
            miw={300}
            key={dept.code}
            withBorder
            radius={4}
            shadow="xs"
            p="md"
            style={{
              position: "relative",
              transition: "transform 0.2s ease",
              borderColor: selectedIds.includes(dept.code)
                ? "green"
                : undefined,
            }}
            onClick={() => toggleSelection(dept.code)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Stack gap="xs">
              <Group justify="space-between">
                <Title order={5}>{dept.name}</Title>
                <Group gap={"xs"}>
                  <Badge variant="light" color="gray">
                    {dept.code}
                  </Badge>
                  {isCheckbox && (
                    <Checkbox
                      radius={4}
                      checked={selectedIds.includes(dept.code)}
                    />
                  )}
                </Group>
              </Group>
              <Text size="sm" c="dimmed">
                {dept.description}
              </Text>
              <Group justify="space-between" mt="xs">
                <Text size="xs" c="dimmed">
                  Ngày tạo:{" "}
                  <Text span fw={500}>
                    {dept.createdAt}
                  </Text>
                </Text>
                <Text size="xs" c="dimmed">
                  Cập nhật:{" "}
                  <Text span fw={500}>
                    {dept.updatedAt}
                  </Text>
                </Text>
              </Group>
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
}
