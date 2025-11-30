import {
  Button,
  Card,
  Group,
  Stepper,
  TextInput,
  Textarea,
  Stack,
  Title,
  Image,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import { DepartmentCardList } from "./components/DepartmentCardList";
import { EmployeeCardList } from "./components/EmployeeCardList";

// Stores
import { useTeamStore } from "../../../zustand/teamStore";
import type { Department } from "../../../zustand/departmentStore";
import type { Employee } from "../../../zustand/employeeStore";
import { useHistoryStore } from "../../../zustand/hrHistoryStore";

const HRManagementTeamAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const { addLog } = useHistoryStore();
  // 1. Get Add Action
  const addTeam = useTeamStore((state) => state.addTeam);

  // 2. Form Setup - Using "departments" and "members" lists
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      departments: [] as Department[], // List of selected Department IDs
      members: [] as Employee[], // List of selected Member IDs
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Tên nhóm phải có ít nhất 2 ký tự" : null,
      departments: (value) =>
        value.length === 0 ? "Vui lòng chọn ít nhất 1 phòng ban" : null,
    },
  });

  // 3. Toggle Handlers
  const toggleDepartment = (department: Department) => {
    const current = form.values.departments;
    const next = current.map((item) => item.id).includes(department.id)
      ? current.filter((item) => item.id !== department.id) // Remove
      : [...current, department]; // Add

    form.setFieldValue("departments", next);
  };

  const toggleMember = (employee: Employee) => {
    const current = form.values.members;
    const next = current.map((item) => item.id).includes(employee.id)
      ? current.filter((item) => item.id !== employee.id)
      : [...current, employee];

    form.setFieldValue("members", next);
  };

  // 4. Navigation Logic
  const handleNextStep = () => {
    if (active === 0) {
      const validation = form.validate();
      if (validation.hasErrors) return;
    }
    setActive((current) => (current < 3 ? current + 1 : current));
  };

  const handlePrevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  // 5. Submit Logic
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Map form values to Store Schema
      await addTeam({
        name: form.values.name,
        description: form.values.description,
        departments: form.values.departments.map((item) => item.name), // Mapping form 'departments' -> store 'departmentIds'
        members: form.values.members.map((item) => ({
          name: item.fullName,
          role: item.role,
        })), // Mapping form 'members' -> store 'memberIds'
        roles: [],
      });
      addLog({
        action: `Tạo đội nhóm mới: ${form.values.name}`,
        entityType: "Team", // Đảm bảo bạn đã thêm "Team" vào type LogEntityType
        performedBy: `TEAM-${Date.now()}`, // Tạo ID giả lập hoặc dùng tên nhóm làm định danh
        targetName: "Admin System",
        // Lưu số lượng thành viên và phòng ban vào chi tiết log
        details: `Thành viên: ${form.values.members.length} | Phòng ban: ${form.values.departments.length}`,
      });
      setActive(3);
    } catch (error) {
      console.error("Failed to add team", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card withBorder shadow="sm" radius={4} p="lg" pos="relative">
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

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
          {/* --- STEP 1: TEAM INFO --- */}
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
                leftSection={<IconSearch size={16} />}
                radius={4}
                readOnly
              />

              <DepartmentCardList
                isCheckbox={true}
                selectedIds={form.values.departments.map((item) => item.id)} // Use 'departments'
                onToggle={toggleDepartment}
              />
              {form.errors.departments && (
                <Text c="red" size="sm">
                  {form.errors.departments}
                </Text>
              )}
            </Stack>
          </Stepper.Step>

          {/* --- STEP 2: MEMBERS --- */}
          <Stepper.Step label="Bước 2" description="Thành viên nhóm">
            <Stack gap={"xs"}>
              <TextInput
                label="Nhân viên"
                placeholder="Tìm kiếm thành viên..."
                leftSection={<IconSearch size={16} />}
                radius={4}
              />
              <EmployeeCardList
                isMultiple={true}
                selectedIds={form.values.members.map((item) => item.id)} // Use 'members'
                onToggle={toggleMember}
              />
            </Stack>
          </Stepper.Step>

          {/* --- STEP 3: CONFIRMATION --- */}
          <Stepper.Step label="Bước 3" description="Xác nhận">
            <Stack gap="sm">
              <Title order={4} c="blue">
                Xác nhận thông tin
              </Title>

              <Card withBorder radius={4} p="sm">
                <Stack gap={4}>
                  <Group>
                    <Text fw={600} size="sm" w={100}>
                      Tên nhóm:
                    </Text>
                    <Text size="sm">{form.values.name}</Text>
                  </Group>
                  <Group align="flex-start">
                    <Text fw={600} size="sm" w={100}>
                      Mô tả:
                    </Text>
                    <Text size="sm">
                      {form.values.description || "(Không có)"}
                    </Text>
                  </Group>
                </Stack>
              </Card>

              <Title order={5} mt="sm">
                Phòng ban đã chọn ({form.values.departments.length})
              </Title>
              <DepartmentCardList
                isCheckbox={false}
                selectedIds={form.values.departments.map((item) => item.id)}
                readonly={true}
              />

              <Title order={5} mt="sm">
                Thành viên đã chọn ({form.values.members.length})
              </Title>
              <EmployeeCardList
                isMultiple={false}
                isTouchable={false}
                selectedIds={form.values.members.map((item) => item.id)}
                filterIds={form.values.members.map((item) => item.id)}
              />
            </Stack>
          </Stepper.Step>

          {/* --- COMPLETED --- */}
          <Stepper.Completed>
            <Stack align="center" justify="center" mt="xl">
              <Image
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPNbBpZeXnXfTuA6AWek-Kj8NYEVbYdG6ayi5bIWarDuryXDrILdKMTd597quLD0PBKM&usqp=CAU"
                }
                w={200}
                fit="cover"
              />
              <Title order={3} ta="center" mt="md">
                Thêm mới nhóm thành công!
              </Title>
              <Text c="dimmed" ta="center">
                Nhóm <b>{form.values.name}</b> đã được tạo. Bạn có thể quay lại
                danh sách để xem chi tiết.
              </Text>

              <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
                Quay về danh sách
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        {active < 3 && (
          <Group justify="space-between" mt="lg">
            <Button
              radius={4}
              variant="default"
              onClick={handlePrevStep}
              disabled={active === 0}
            >
              Quay lại
            </Button>

            {active === 2 ? (
              <Button radius={4} onClick={handleSubmit} color="green">
                Hoàn thành
              </Button>
            ) : (
              <Button radius={4} onClick={handleNextStep}>
                Tiếp tục
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </Card>
  );
};

export default HRManagementTeamAddPage;
