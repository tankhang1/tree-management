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
      name: "",
      description: "",
      departments: [],
      roles: [],
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
        </Stepper>

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
            onClick={() => setActive((prev) => Math.min(prev + 1, 1))}
          >
            {active === 1 ? "Tạo nhóm" : "Tiếp tục"}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default HRManagementTeamAddPage;
