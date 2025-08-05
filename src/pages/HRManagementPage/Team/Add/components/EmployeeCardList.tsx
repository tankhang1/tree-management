import {
  Card,
  Group,
  Stack,
  Text,
  Badge,
  Image,
  Divider,
  Tooltip,
  Button,
  Checkbox,
} from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import { useState } from "react";

const employees = [
  {
    id: "EMP001",
    username: "nguyenvana",
    fullName: "Nguyễn Văn A",
    dob: "1990-05-10",
    role: "Kỹ sư canh tác",
    level: "Trưởng nhóm",
    department: "Phòng Nông Nghiệp",
    status: "Đang hoạt động",
    manager: "Lê Thị B",
  },
  {
    id: "EMP002",
    username: "tranthib",
    fullName: "Trần Thị B",
    dob: "1992-08-15",
    role: "Nhân viên kỹ thuật",
    level: "Nhân viên",
    department: "Phòng Kỹ Thuật",
    status: "Thử việc",
    manager: "Nguyễn Văn A",
  },
  {
    id: "EMP003",
    username: "levanc",
    fullName: "Lê Văn C",
    dob: "1988-03-22",
    role: "Nhân viên kho",
    level: "Nhân viên",
    department: "Phòng Vật Tư",
    status: "Đang hoạt động",
    manager: "Phạm Thị D",
  },
  {
    id: "EMP004",
    username: "phamthid",
    fullName: "Phạm Thị D",
    dob: "1995-11-05",
    role: "Trưởng nhóm nghiên cứu",
    level: "Trưởng nhóm",
    department: "Phòng Nghiên Cứu",
    status: "Đang hoạt động",
    manager: "Lê Văn E",
  },
  {
    id: "EMP005",
    username: "nguyenvane",
    fullName: "Nguyễn Văn E",
    dob: "1993-06-18",
    role: "Nhân viên phát triển sản phẩm",
    level: "Nhân viên",
    department: "Phòng Phát Triển",
    status: "Đang hoạt động",
    manager: "Phạm Thị D",
  },
  {
    id: "EMP006",
    username: "tranvanf",
    fullName: "Trần Văn F",
    dob: "1985-12-30",
    role: "Trưởng nhóm kinh doanh",
    level: "Trưởng nhóm",
    department: "Phòng Kinh Doanh",
    status: "Đang hoạt động",
    manager: "Nguyễn Thị G",
  },
  {
    id: "EMP007",
    username: "nguyenthig",
    fullName: "Nguyễn Thị G",
    dob: "1990-09-12",
    role: "Nhân viên chăm sóc khách hàng",
    level: "Nhân viên",
    department: "Phòng Chăm Sóc Khách Hàng",
    status: "Đang hoạt động",
    manager: "Trần Văn F",
  },
  {
    id: "EMP008",
    username: "phamvanh",
    fullName: "Phạm Văn H",
    dob: "1987-04-25",
    role: "Chuyên viên Marketing",
    level: "Nhân viên",
    department: "Phòng Marketing",
    status: "Đang hoạt động",
    manager: "Nguyễn Thị I",
  },
  {
    id: "EMP009",
    username: "nguyenthii",
    fullName: "Nguyễn Thị I",
    dob: "1991-07-19",
    role: "Trưởng nhóm Marketing",
    level: "Trưởng nhóm",
    department: "Phòng Marketing",
    status: "Đang hoạt động",
    manager: "Lê Văn J",
  },
  {
    id: "EMP010",
    username: "levanj",
    fullName: "Lê Văn J",
    dob: "1983-02-14",
    role: "Trưởng phòng hành chính",
    level: "Trưởng phòng",
    department: "Phòng Hành Chính",
    status: "Đang hoạt động",
    manager: "Nguyễn Văn K",
  },
];

function getStatusColor(status: string) {
  return status === "Đang hoạt động"
    ? "green"
    : status === "Thử việc"
    ? "yellow"
    : "gray";
}

type TEmployeeCard = {
  isDelete?: boolean;
  isMultiple?: boolean;
  isTouchable?: boolean;
};

export function EmployeeCardList({
  isDelete = false,
  isMultiple = true,
  isTouchable = true,
}: TEmployeeCard) {
  const [selected, setSelected] = useState<string[]>([]);
  const onSelect = (id: string) => {
    if (!isTouchable) return;
    if (isMultiple) {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setSelected([id]);
    }
  };
  return (
    <Scrollable h={220}>
      <Group gap="lg" align="flex-start" wrap="nowrap" p="xs">
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
              borderColor: selected.includes(emp.id) ? "green" : undefined,
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onClick={() => onSelect(emp.id)}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Group align="flex-start" gap="md">
              <Image
                src={
                  "https://faceinch.vn/upload/elfinder/Ảnh/chup-chan-dung.jpg"
                }
                h={160}
                w={100}
                radius={4}
                fit="cover"
                alt="Employee Avatar"
              />
              <Stack gap={4} style={{ flex: 1 }}>
                <Group justify="space-between">
                  <Text fw={600} size="lg">
                    {emp.fullName}
                  </Text>
                  <Group gap={"xs"}>
                    <Badge color={getStatusColor(emp.status)}>
                      {emp.status}
                    </Badge>
                    {isMultiple && (
                      <Checkbox
                        radius={4}
                        checked={selected.includes(emp.id)}
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
                  <b>Phòng ban:</b> {emp.department}
                </Text>
                <Text size="sm" c="dimmed">
                  <b>Người quản lý:</b> {emp.manager}
                </Text>
              </Stack>
            </Group>
            {isDelete && (
              <Tooltip label="Xóa nhân sự" position="top" withArrow>
                <Button
                  pos="absolute"
                  variant="light"
                  color="red"
                  right={16}
                  bottom={16}
                  radius={4}
                >
                  Xoá
                </Button>
              </Tooltip>
            )}
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
}
