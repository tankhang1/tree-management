import {
  Button,
  Card,
  Group,
  Stepper,
  TextInput,
  Textarea,
  // MultiSelect,
  Stack,
  Title,
  Image,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DepartmentCardList } from "./components/DepartmentCardList";
import { EmployeeCardList } from "./components/EmployeeCardList";

// const mockRoles = [
//   { value: "leader", label: "Trưởng nhóm" },
//   { value: "member", label: "Thành viên" },
//   { value: "viewer", label: "Người xem" },
// ];

const HRManagementTeamAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const form = useForm({
    initialValues: {
      name: "Nhóm Giám Sát Sản Xuất",
      description: "Phụ trách giám sát tiến độ và chất lượng vùng trồng A & B",
      departments: ["Phòng Kỹ Thuật", "Phòng Vận Hành"],
      roles: ["leader", "member"],
      members: [],
    },
  });

  return (
    <Card withBorder shadow="sm" radius={4} p="lg">
      <Stack>
        <Group mb={"md"}>
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>Tạo Nhóm Mới</Title>
        </Group>
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
        >
          <Stepper.Step label="Bước 1" description="Thông tin nhóm">
            <Stack gap={"xs"}>
              <TextInput
                label="Tên nhóm"
                placeholder="Nhập tên nhóm"
                withAsterisk
                {...form.getInputProps("name")}
                radius={4}
              />
              <Textarea
                label="Mô tả"
                placeholder="Nhập mô tả nhóm (nếu có)"
                {...form.getInputProps("description")}
                radius={4}
              />
              <TextInput
                label="Phòng ban"
                placeholder="Tìm kiếm phòng ban liên quan"
                {...form.getInputProps("departments")}
                leftSection={<IconSearch size={16} />}
                radius={4}
              />
              <DepartmentCardList />
              {/* <MultiSelect
                label="Vai trò"
                placeholder="Chọn vai trò của nhóm"
                data={mockRoles}
                {...form.getInputProps("roles")}
                radius={4}
              /> */}
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Bước 2" description="Thành viên nhóm">
            <Stack gap={"xs"}>
              <TextInput
                label="Tìm kiếm nhân viên"
                placeholder="Chọn thành viên từ nhân sự"
                leftSection={<IconSearch size={16} />}
                {...form.getInputProps("members")}
                radius={4}
              />
              <EmployeeCardList />
            </Stack>
          </Stepper.Step>
          <Stepper.Step label="Bước 3" description="Xác nhận">
            <Card withBorder shadow="sm" radius={4} p="md">
              <Stack gap="sm">
                <Title order={3}>Xác nhận thông tin nhóm</Title>

                <Stack gap={4}>
                  <Group>
                    <b>Tên nhóm:</b>
                    <span>{form.values.name || "(chưa nhập)"}</span>
                  </Group>
                  <Group>
                    <b>Mô tả:</b>
                    <span>{form.values.description || "(không có)"}</span>
                  </Group>
                </Stack>

                <Title order={5} mt="md">
                  Danh sách phòng ban
                </Title>
                <DepartmentCardList />
                <Title order={5} mt="md">
                  Danh sách nhân sự
                </Title>
                <EmployeeCardList />
              </Stack>
            </Card>
          </Stepper.Step>
          <Stepper.Completed>
            <Stack align="center" justify="center" mt="xl">
              <Image
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPNbBpZeXnXfTuA6AWek-Kj8NYEVbYdG6ayi5bIWarDuryXDrILdKMTd597quLD0PBKM&usqp=CAU"
                }
                w={200}
                fit="cover"
              />
              <Text fz={"h2"} ta="center">
                Thêm mới nhóm thành công!
              </Text>
              <Text fz={"md"} ta="center" c="dimmed">
                Nhóm mới đã được tạo thành công. Bạn có thể xem lại thông tin
                chi tiết trong danh sách nhóm.
              </Text>

              <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
                Xác nhận
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        {active < 3 && (
          <Group justify="space-between" mt="lg">
            <Button
              radius={4}
              variant="default"
              onClick={() => setActive((prev) => Math.max(prev - 1, 0))}
            >
              Quay lại
            </Button>
            <Button
              radius={4}
              onClick={() => setActive((prev) => Math.min(prev + 1, 3))}
            >
              {active === 2 ? "Hoàn thành" : "Tiếp tục"}
            </Button>
          </Group>
        )}
      </Stack>
    </Card>
  );
};

export default HRManagementTeamAddPage;
