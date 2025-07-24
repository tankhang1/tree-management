import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Input,
  MultiSelect,
  Select,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
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
const banksData = [
  { label: "Vietcombank (VCB)", value: "vcb" },
  { label: "VietinBank (CTG)", value: "ctg" },
  { label: "BIDV (BID)", value: "bid" },
  { label: "Techcombank (TCB)", value: "tcb" },
];
const HRManagementEmployeeAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [banks, setBanks] = useState([
    { bank: "", accountHolder: "", accountNumber: "", branch: "", note: "" },
  ]);
  return (
    <Card withBorder shadow="sm" radius={4} p="lg">
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
      <form>
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
        >
          <Stepper.Step label="Bước 1" description="Thông tin cơ bản">
            <Stack gap={"xs"}>
              <Input.Wrapper label="Ảnh đại diện">
                <Dropzone
                  onDrop={(files) => console.log("accepted files", files)}
                  onReject={(files) => console.log("rejected files", files)}
                  maxSize={5 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                >
                  <Group
                    justify="center"
                    gap="xl"
                    mih={220}
                    style={{ pointerEvents: "none" }}
                  >
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
                        Drag images here or click to select files
                      </Text>
                      <Text size="sm" c="dimmed" inline mt={7}>
                        Attach as many files as you like, each file should not
                        exceed 5mb
                      </Text>
                    </div>
                  </Group>
                </Dropzone>
              </Input.Wrapper>
              <TextInput label="Tên" placeholder="Tên" radius={4} />
              <TextInput
                label="Số điện thoại"
                placeholder="Số điện thoại"
                radius={4}
              />
              <Select
                placeholder="Chọn tỉnh thành/ thành phố"
                label="Chọn tỉnh thành"
                radius={4}
              />
              {/* <Select
                placeholder="Chọn thành phố"
                label="Chọn thành phố"
                radius={4}
              /> */}
              <Select
                placeholder="Chọn phường/xã"
                label="Chọn phường/xã"
                radius={4}
              />
              <TextInput
                label="Địa chỉ chi tiết"
                placeholder="Địa chỉ chi tiết"
                radius={4}
              />
              <TextInput
                label="Mã số thuế"
                placeholder="Mã số thuế"
                radius={4}
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
          <Stepper.Step label="Bước 2" description="Thông tin trực thuộc">
            <Stack gap={"xs"}>
              <MultiSelect
                label="Chọn phòng ban"
                radius={4}
                data={["Ban tài chính", "Ban kĩ thuật", "Ban kế hoạch"]}
              />
              <TextInput
                label="Chọn đội nhóm"
                placeholder="Tìm kiếm đội nhóm"
                leftSection={<IconSearch size={18} />}
                radius={4}
              />
              <SelectableTeamCards />
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
          <Stepper.Step label="Bước 3" description="Thông tin ngân hàng">
            <Stack gap={"xs"}>
              {banks.map((bank, idx) => (
                <Card key={idx} withBorder>
                  <Grid>
                    <Grid.Col span={6}>
                      <Select label="Ngân hàng" radius={4} data={banksData} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput label="Chủ tài khoản" radius={4} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput label="Số tài khoản" radius={4} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput label="Chi nhánh (nếu có)" radius={4} />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Textarea label="Ghi chú" minRows={2} radius={4} />
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
          <Stepper.Step label="Bước 4" description="Xác nhận thông tin">
            <Stack gap="md">
              <Group grow>
                <Card
                  h={200}
                  flex={1}
                  withBorder
                  radius="md"
                  shadow="xs"
                  p="md"
                >
                  <Title order={5} mb="xs">
                    Thông tin cơ bản
                  </Title>
                  <Stack gap={4}>
                    <Group>
                      <Text size="sm" c="dimmed">
                        Tên:
                      </Text>
                      <Text size="sm">Nguyễn Văn A</Text>
                    </Group>
                    <Group>
                      <Text size="sm" c="dimmed">
                        Số điện thoại:
                      </Text>
                      <Text size="sm">0123456789</Text>
                    </Group>
                    <Group>
                      <Text size="sm" c="dimmed">
                        Tỉnh thành:
                      </Text>
                      <Text size="sm">TP.HCM</Text>
                    </Group>
                    <Group>
                      <Text size="sm" c="dimmed">
                        Địa chỉ:
                      </Text>
                      <Text size="sm">123 Đường ABC, Phường X</Text>
                    </Group>
                    <Group>
                      <Text size="sm" c="dimmed">
                        Mã số thuế:
                      </Text>
                      <Text size="sm">123456789</Text>
                    </Group>
                  </Stack>
                </Card>
                <Card h={200} withBorder radius="md" shadow="xs" p="md">
                  <Title order={5} mb="xs">
                    🏦 Thông tin ngân hàng
                  </Title>
                  <Stack gap={4}>
                    <Group>
                      <Text size="sm" c="dimmed">
                        Ngân hàng:
                      </Text>
                      <Text size="sm">Techcombank (TCB)</Text>
                    </Group>
                    <Group>
                      <Text size="sm" c="dimmed">
                        Số tài khoản:
                      </Text>
                      <Text size="sm">19001234567890</Text>
                    </Group>
                    <Group>
                      <Text size="sm" c="dimmed">
                        Chủ tài khoản:
                      </Text>
                      <Text size="sm">Đoàn Tấn Khang</Text>
                    </Group>
                    <Group>
                      <Text size="sm" c="dimmed">
                        Chi nhánh:
                      </Text>
                      <Text size="sm">Chi nhánh Sài Gòn</Text>
                    </Group>
                  </Stack>
                </Card>
              </Group>
              <Input.Wrapper label="Danh sách phòng ban">
                <Group gap={"xs"}>
                  {["Ban tài chính", "Ban kĩ thuật", "Ban kế hoạch"].map(
                    (dept) => (
                      <Badge key={dept} size="lg">
                        {dept}
                      </Badge>
                    )
                  )}
                </Group>
              </Input.Wrapper>
              <SelectableTeamCards isCheckbox={false} />

              <Group justify="space-between">
                <Button variant="default" onClick={prevStep} radius={4}>
                  Quay lại
                </Button>
                <Button
                  color="green"
                  radius={4}
                  onClick={() => alert("Đã xác nhận!")}
                >
                  Xác nhận & Hoàn tất
                </Button>
              </Group>
            </Stack>
          </Stepper.Step>
        </Stepper>
      </form>
    </Card>
  );
};

export default HRManagementEmployeeAddPage;
