import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Input,
  LoadingOverlay,
  MultiSelect,
  Select,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput,
  Title,
  Avatar,
  SimpleGrid,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectableTeamCards } from "./components/SelectableTeamCards";
import {
  useEmployeeStore,
  type BankInfo,
} from "../../../zustand/employeeStore";
import { useDepartmentStore } from "../../../zustand/departmentStore";
import { usePositionStore } from "../../../zustand/positionStore";
import { useTeamStore } from "../../../zustand/teamStore";

const HRManagementEmployeeAddPage = () => {
  const navigate = useNavigate();

  // Stores
  const { departments } = useDepartmentStore();
  const { positions } = usePositionStore();
  const { teams } = useTeamStore(); // Lấy danh sách team để mapping tên ở bước cuối
  const { addEmployee, isLoading } = useEmployeeStore();

  const [active, setActive] = useState(0);

  // Form management
  const form = useForm({
    initialValues: {
      fullName: "",
      phone: "",
      province: "",
      district: "",
      address: "",
      taxCode: "",
      avatarUrl: "",
      departments: [],
      teams: [], // Array string ID của team
      role: "Nhân viên",
      level: "Nhân viên",
      status: "active",
    },
    validate: {
      fullName: (value) =>
        value.length < 2 ? "Tên phải có ít nhất 2 ký tự" : null,
      phone: (value) =>
        /^\d{10,11}$/.test(value) ? null : "Số điện thoại không hợp lệ",
    },
  });

  // Local state for banks
  const [banks, setBanks] = useState<BankInfo[]>([
    { bank: "", accountHolder: "", accountNumber: "", branch: "", note: "" },
  ]);

  // Handle Team Selection Logic
  const handleToggleTeam = (teamId: string) => {
    const currentTeams = form.values.teams;
    if (currentTeams.includes(teamId)) {
      form.setFieldValue(
        "teams",
        currentTeams.filter((id) => id !== teamId)
      );
    } else {
      form.setFieldValue("teams", [...currentTeams, teamId]);
    }
  };

  // Helper to get Team Names for Confirmation Step
  const getSelectedTeamNames = () => {
    return teams
      .filter((t) => form.values.teams.includes(t.id))
      .map((t) => t.name);
  };

  const handleImageDrop = (files: File[]) => {
    const file = files[0];
    const reader = new FileReader();
    form.setFieldValue("avatarUrl", URL.createObjectURL(file) as string);

    reader.readAsDataURL(file);
  };

  const nextStep = () => {
    if (active === 0) {
      const result = form.validate();
      if (result.hasErrors) return;
    }
    setActive((current) => (current < 4 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const updateBank = (index: number, field: keyof BankInfo, value: string) => {
    const newBanks = [...banks];
    newBanks[index] = { ...newBanks[index], [field]: value };
    setBanks(newBanks);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form.values,
      username: form.values.phone,
      banks: banks.filter((b) => b.bank && b.accountNumber),
    };
    const success = await addEmployee(payload);
    if (success) {
      setActive(4);
    }
  };

  return (
    <Card withBorder shadow="sm" radius={4} p="lg" pos="relative">
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Thêm mới nhân sự</Title>
      </Group>

      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
      >
        {/* --- STEP 1: BASIC INFO --- */}
        <Stepper.Step label="Bước 1" description="Thông tin cơ bản">
          {/* ... (Giữ nguyên code phần Step 1 của bạn) ... */}
          <Group grow align="flex-start">
            <Stack gap={"xs"}>
              <TextInput
                withAsterisk
                label="Tên"
                placeholder="Nguyễn Văn A"
                radius={4}
                {...form.getInputProps("fullName")}
              />
              <TextInput
                withAsterisk
                label="Số điện thoại"
                placeholder="0912345678"
                radius={4}
                {...form.getInputProps("phone")}
              />
              <Select
                searchable
                clearable
                placeholder="Chọn tỉnh thành/ thành phố"
                label="Tỉnh thành"
                radius={4}
                data={["Hà Nội", "TP.HCM", "Đà Nẵng", "Cần Thơ", "Bình Dương"]}
                {...form.getInputProps("province")}
              />

              <Select
                searchable
                clearable
                placeholder="Chọn quận/huyện"
                label="Quận/Huyện"
                radius={4}
                data={["Quận 1", "Quận 2", "Quận 3", "Thủ Đức", "Bình Thạnh"]}
                {...form.getInputProps("district")}
              />
              <TextInput
                label="Địa chỉ chi tiết"
                placeholder="Số nhà, đường..."
                radius={4}
                {...form.getInputProps("address")}
              />
              <TextInput
                label="Mã số thuế"
                placeholder="Mã số thuế cá nhân"
                radius={4}
                {...form.getInputProps("taxCode")}
              />
            </Stack>
            <Stack gap={"xs"}>
              <Input.Wrapper label="Ảnh đại diện">
                <Dropzone
                  onDrop={handleImageDrop}
                  onReject={(files) => console.log("rejected files", files)}
                  maxSize={5 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                  multiple={false}
                >
                  <Group
                    justify="center"
                    gap="xl"
                    mih={220}
                    style={{ pointerEvents: "none" }}
                  >
                    {form.values.avatarUrl ? (
                      <Stack align="center">
                        <Avatar
                          src={form.values.avatarUrl}
                          size={120}
                          radius="xl"
                        />
                        <Text size="sm" c="dimmed">
                          Kéo thả để thay đổi ảnh
                        </Text>
                      </Stack>
                    ) : (
                      <>
                        <Dropzone.Accept>
                          <IconUpload
                            size={52}
                            color="var(--mantine-color-blue-6)"
                            stroke={1.5}
                          />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                          <IconX
                            size={52}
                            color="var(--mantine-color-red-6)"
                            stroke={1.5}
                          />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                          <IconPhoto
                            size={52}
                            color="var(--mantine-color-dimmed)"
                            stroke={1.5}
                          />
                        </Dropzone.Idle>
                        <div>
                          <Text size="xl" inline>
                            Bỏ và thả ảnh đại diện tại đây
                          </Text>
                          <Text size="sm" c="dimmed" inline mt={7}>
                            Đính kèm ảnh đại diện (tối đa 5MB)
                          </Text>
                        </div>
                      </>
                    )}
                  </Group>
                </Dropzone>
              </Input.Wrapper>
            </Stack>
          </Group>
          <Group justify="space-between" mt="md">
            <Button variant="default" onClick={() => navigate(-1)} radius={4}>
              Hủy bỏ
            </Button>
            <Button onClick={nextStep} radius={4}>
              Tiếp theo
            </Button>
          </Group>
        </Stepper.Step>

        {/* --- STEP 2: DEPARTMENTS & TEAMS --- */}
        <Stepper.Step label="Bước 2" description="Thông tin trực thuộc">
          <Stack gap={"xs"}>
            <MultiSelect
              label="Phòng ban"
              radius={4}
              data={departments.map((item) => item.name)}
              placeholder="Chọn phòng ban"
              {...form.getInputProps("departments")}
            />

            <SimpleGrid cols={2}>
              <TextInput
                label="Chức vụ (Role)"
                placeholder="Ví dụ: Kỹ sư, Tài xế"
                radius={4}
                {...form.getInputProps("role")}
              />
              <Select
                label="Cấp bậc (Level)"
                radius={4}
                data={positions.map((item) => item.name)}
                {...form.getInputProps("level")}
              />
            </SimpleGrid>

            <TextInput
              label="Tìm kiếm đội nhóm"
              placeholder="Nhập tên đội nhóm..."
              leftSection={<IconSearch size={18} />}
              radius={4}
            />

            {/* Truyền selectedIds và hàm onToggle xuống component con */}
            <SelectableTeamCards
              isCheckbox={true}
              selectedIds={form.values.teams}
              onToggle={handleToggleTeam}
            />

            <Group justify="space-between" mt="md">
              <Button variant="default" onClick={prevStep} radius={4}>
                Quay lại
              </Button>
              <Button onClick={nextStep} radius={4}>
                Tiếp theo
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        {/* --- STEP 3: BANKING (Giữ nguyên) --- */}
        <Stepper.Step label="Bước 3" description="Thông tin ngân hàng">
          <Stack gap={"xs"}>
            {banks.map((bank, idx) => (
              <Card key={idx} withBorder>
                <Grid>
                  <Grid.Col span={6}>
                    <Select
                      label="Ngân hàng"
                      placeholder="Chọn ngân hàng"
                      data={[
                        "Vietcombank",
                        "Techcombank",
                        "MBBank",
                        "Agribank",
                        "BIDV",
                      ]}
                      value={bank.bank}
                      onChange={(val) => updateBank(idx, "bank", val || "")}
                      searchable
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Chủ tài khoản"
                      radius={4}
                      value={bank.accountHolder}
                      onChange={(e) =>
                        updateBank(idx, "accountHolder", e.target.value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Số tài khoản"
                      radius={4}
                      value={bank.accountNumber}
                      onChange={(e) =>
                        updateBank(idx, "accountNumber", e.target.value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Chi nhánh"
                      radius={4}
                      value={bank.branch}
                      onChange={(e) =>
                        updateBank(idx, "branch", e.target.value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Textarea
                      label="Ghi chú"
                      minRows={2}
                      radius={4}
                      value={bank.note}
                      onChange={(e) => updateBank(idx, "note", e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Group justify="flex-end">
                      <Button
                        color="red"
                        variant="light"
                        radius={4}
                        onClick={() =>
                          setBanks(banks.filter((_, i) => i !== idx))
                        }
                      >
                        Xoá
                      </Button>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Card>
            ))}
            <Button
              variant="light"
              radius={4}
              leftSection={<IconPlus />}
              onClick={() =>
                setBanks([
                  ...banks,
                  {
                    bank: "",
                    accountHolder: "",
                    accountNumber: "",
                    branch: "",
                    note: "",
                  },
                ])
              }
            >
              Thêm tài khoản ngân hàng
            </Button>
            <Group justify="space-between" mt="md">
              <Button variant="default" onClick={prevStep} radius={4}>
                Quay lại
              </Button>
              <Button onClick={nextStep} radius={4}>
                Tiếp theo
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        {/* --- STEP 4: CONFIRMATION --- */}
        <Stepper.Step label="Bước 4" description="Xác nhận thông tin">
          <Stack gap="md">
            <Group grow align="flex-start">
              {/* Basic Info Card */}
              <Card h={220} flex={1} withBorder radius="md" shadow="xs" p="md">
                <Group justify="space-between">
                  <Title order={5} mb="xs">
                    Thông tin cơ bản
                  </Title>
                  {form.values.avatarUrl && (
                    <Avatar src={form.values.avatarUrl} radius="xl" />
                  )}
                </Group>
                <Stack gap={4}>
                  <Group>
                    <Text size="sm" c="dimmed">
                      Tên:
                    </Text>
                    <Text size="sm" fw={500}>
                      {form.values.fullName}
                    </Text>
                  </Group>
                  <Group>
                    <Text size="sm" c="dimmed">
                      Số điện thoại:
                    </Text>
                    <Text size="sm">{form.values.phone}</Text>
                  </Group>
                  <Group>
                    <Text size="sm" c="dimmed">
                      Tỉnh/Thành:
                    </Text>
                    <Text size="sm">{form.values.province}</Text>
                  </Group>
                  <Group>
                    <Text size="sm" c="dimmed">
                      Địa chỉ:
                    </Text>
                    <Text size="sm">{form.values.address}</Text>
                  </Group>
                </Stack>
              </Card>

              {/* Banking Card */}
              <Card h={220} withBorder radius="md" shadow="xs" p="md">
                <Title order={5} mb="xs">
                  🏦 Thông tin ngân hàng
                </Title>
                {banks.length > 0 && banks[0].bank ? (
                  <Stack gap={4}>
                    <Group>
                      <Text size="sm" c="dimmed">
                        Ngân hàng:
                      </Text>
                      <Text size="sm">{banks[0].bank}</Text>
                    </Group>
                    <Group>
                      <Text size="sm" c="dimmed">
                        Số tài khoản:
                      </Text>
                      <Text size="sm">{banks[0].accountNumber}</Text>
                    </Group>
                    <Group>
                      <Text size="sm" c="dimmed">
                        Chủ tài khoản:
                      </Text>
                      <Text size="sm">{banks[0].accountHolder}</Text>
                    </Group>
                    {banks.length > 1 && (
                      <Text size="xs" c="blue" mt="xs">
                        + {banks.length - 1} tài khoản khác
                      </Text>
                    )}
                  </Stack>
                ) : (
                  <Text size="sm" c="dimmed" fs="italic">
                    Chưa có thông tin ngân hàng
                  </Text>
                )}
              </Card>
            </Group>

            <Input.Wrapper label="Phòng ban & Chức vụ & Đội nhóm">
              <Stack gap="xs">
                <Group gap="xs">
                  {form.values.departments.map((dept) => (
                    <Badge key={dept} size="lg" variant="dot">
                      {dept}
                    </Badge>
                  ))}
                  <Badge color="grape">{form.values.role}</Badge>
                  <Badge color="orange">{form.values.level}</Badge>
                </Group>

                {/* Hiển thị các Team đã chọn */}
                {form.values.teams.length > 0 && (
                  <Group gap="xs">
                    {getSelectedTeamNames().map((name) => (
                      <Badge
                        key={name}
                        color="teal"
                        variant="light"
                        leftSection="🛡️"
                      >
                        {name}
                      </Badge>
                    ))}
                  </Group>
                )}
              </Stack>
            </Input.Wrapper>

            {/* Readonly Team Cards view in Step 4 */}
            <SelectableTeamCards
              isCheckbox={false}
              selectedIds={form.values.teams}
            />

            <Group justify="space-between" mt="xl">
              <Button variant="default" onClick={prevStep} radius={4}>
                Quay lại
              </Button>
              <Button
                color="green"
                radius={4}
                onClick={handleSubmit}
                loading={isLoading}
              >
                Hoàn thành
              </Button>
            </Group>
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
            <Text fz={"h2"} ta="center">
              Thêm mới nhân sự thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Nhân sự <b>{form.values.fullName}</b> đã được thêm thành công.
            </Text>
            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Quay về danh sách
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>
    </Card>
  );
};

export default HRManagementEmployeeAddPage;
