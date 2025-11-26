import {
  Group,
  Card,
  Stack,
  Title,
  TextInput,
  NumberInput,
  Textarea,
  Select,
  Radio,
  Text,
  Button,
  Input,
  Modal,
  ActionIcon,
  Image,
  Badge,
  Divider,
} from "@mantine/core";
import { useState } from "react";
import {
  IconSearch,
  IconUpload,
  IconX,
  IconPhoto,
  IconArrowLeft,
  IconTrash,
} from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import SunEditor from "suneditor-react";
import { cropOptions, seedOptions } from "../../AreaManagementPage/Row/Add";
import CropCards from "../../SeasonManagementPage/Growth/Add/components/CropCards";
import { DateTimePicker } from "@mantine/dates";
import { useNavigate } from "react-router-dom";
import Scrollable from "../../../components/Scrollable";
import SeedCards from "../../SeasonManagementPage/Growth/Add/components/SeedCards";

const livestockData = [
  {
    id: "ANM001",
    name: "Bò sữa HF",
    seed: "Giống bò sữa Holstein Friesian",
    harvestMethod: "Vắt sữa thủ công & máy",
    growthCycle: "Chu kỳ sữa 305 ngày/năm",
    note: "Yêu cầu khí hậu mát mẻ, chuồng trại thoáng mát",
    image:
      "https://channuoithuy.com.vn/wp-content/uploads/2023/07/bo-ha-lan-1.jpg",
  },
  {
    id: "ANM002",
    name: "Heo Landrace",
    seed: "Giống heo Landrace thuần",
    harvestMethod: "Xuất bán thịt",
    growthCycle: "5-6 tháng đạt trọng lượng 100kg",
    note: "Cần khẩu phần ăn giàu protein",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/24/Truie_Landrace.jpg",
  },
  {
    id: "ANM003",
    name: "Gà ri",
    seed: "Giống gà ri thuần",
    harvestMethod: "Xuất bán thịt hoặc trứng",
    growthCycle: "5-6 tháng",
    note: "Chăn thả vườn, ăn tạp",
    image:
      "https://gionggaquy.com/uploads/product/size610/product1/1/product_24.jpg",
  },
];

export default function CertificateAddPageGroup() {
  const navigate = useNavigate();
  const [openedFilter, setOpenedFilter] = useState(false);
  const [fileType, setFileType] = useState<"file" | "editor">("file");
  const [treeType, setTreeType] = useState("crop");
  return (
    <Card withBorder shadow="sm" radius={4} p="lg">
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Thêm mới chứng nhận / chứng chỉ</Title>
      </Group>
      <Stack gap="xs">
        {/* Group chứa các Card */}
        <Group grow align="flex-start" wrap="wrap" gap="lg">
          <Stack gap="xs">
            {/* Card: Tổ chức chứng nhận */}
            <Card withBorder shadow="sm" radius={4} flex={1}>
              <Title order={5} mb="md">
                🏢 Tổ chức chứng nhận
              </Title>
              <Stack gap="sm">
                <Input.Wrapper label="Dấu mộc chứng nhận">
                  <Dropzone
                    onDrop={(files) => console.log("accepted files", files)}
                    maxSize={5 * 1024 ** 2}
                    radius={4}
                    accept={["application/pdf"]}
                  >
                    <Group
                      justify="center"
                      gap="xl"
                      mih={180}
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
                        <Text size="lg">Kéo & thả dấu mộc vào đây</Text>
                        <Text size="sm" c="dimmed">
                          Tối đa 5MB
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                </Input.Wrapper>
                <Select
                  searchable
                  clearable
                  label="Tên tổ chức cấp"
                  defaultValue="Tổ chức VietGAP"
                  required
                  radius={4}
                  data={[
                    "Tổ chức VietGAP",
                    "Tổ chức Organic Vietnam",
                    "Tổ chức GlobalGAP",
                  ]}
                />
              </Stack>
            </Card>
            {/* Card: Tiêu chí yêu cầu */}
          </Stack>
          {/* Card: Thông tin chứng nhận */}
          <Card withBorder shadow="sm" radius={4} h={385}>
            <Title order={5} mb="md">
              📌 Tiêu chí yêu cầu
            </Title>
            <Stack gap="sm">
              <Radio.Group
                label="Nội dung giấy chứng nhận"
                value={fileType}
                onChange={(val) => setFileType(val as "file" | "editor")}
              >
                <Group mt="xs">
                  <Radio value="file" label="Tải file PDF" />
                  <Radio value="editor" label="Nhập nội dung" />
                </Group>
              </Radio.Group>

              {fileType === "file" ? (
                <Dropzone
                  onDrop={(files) => console.log("accepted files", files)}
                  maxSize={5 * 1024 ** 2}
                  radius={4}
                  h={240}
                  accept={["application/pdf"]}
                >
                  <Group
                    justify="center"
                    align="center"
                    gap="xl"
                    h={240}
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

                    <Stack gap={"xs"}>
                      <Text size="lg">Kéo & thả file PDF vào đây</Text>
                      <Text size="sm" c="dimmed">
                        Tối đa 5MB
                      </Text>
                    </Stack>
                  </Group>
                </Dropzone>
              ) : (
                <SunEditor
                  height="180px"
                  setOptions={{
                    buttonList: [
                      ["undo", "redo"],
                      ["bold", "italic", "underline"],
                      ["list", "align", "link"],
                      ["image", "table", "codeView"],
                    ],
                  }}
                />
              )}
            </Stack>
          </Card>
        </Group>
        <Card withBorder shadow="sm" radius={4} flex={1}>
          <Title order={5} mb="md">
            📄 Thông tin chứng nhận
          </Title>
          <Stack gap="sm">
            <Group grow>
              <TextInput
                label="Mã số chứng nhận"
                defaultValue="GCN-VG-2025-001"
                radius={4}
              />
              <TextInput
                label="Tên chứng nhận"
                defaultValue="Chứng nhận VietGAP"
                radius={4}
              />
            </Group>
            <Group grow>
              <DateTimePicker
                radius={4}
                label="Thời gian cấp"
                defaultValue="01/08/2025"
              />
              <NumberInput
                label="Thời gian hiệu lực (năm)"
                defaultValue={3}
                min={1}
              />
            </Group>
            <Textarea
              label="Định nghĩa"
              defaultValue="VietGAP là tiêu chuẩn sản xuất nông nghiệp tốt..."
              minRows={3}
              radius={4}
            />
          </Stack>
        </Card>
        {/* <Group grow gap={"md"} align="flex-start">
          <Card withBorder radius={4} shadow="sm">
            <Stack gap={"xs"}>
              <Title order={4}>Cây trồng</Title>
              <Divider />
              <Radio.Group
                mt={"md"}
                defaultValue={treeType}
                onChange={setTreeType}
              >
                <Stack gap={"xs"}>
                  <Radio value="crop" label="Chứng nhận cấp theo cây trồng" />
                  <Radio
                    value="seed"
                    label="Chứng nhận cấp theo giống cây trồng"
                  />
                </Stack>
              </Radio.Group>
              <Group>
                <Button radius={4} onClick={() => setOpenedFilter(true)}>
                  Thêm mới
                </Button>
              </Group>
              {treeType === "crop" ? (
                <SeedCards
                  selected=""
                  seeds={seedOptions}
                  onSelect={() => {}}
                  isDelete
                  isCheckbox={false}
                />
              ) : (
                <CropCards
                  selected=""
                  plants={cropOptions}
                  onSelect={() => {}}
                  isCheckbox={false}
                  isTouchable={false}
                  isDelete={true}
                />
              )}
            </Stack>
          </Card>
          <Card withBorder radius={4} shadow="sm">
            <Stack gap={"xs"}>
              <Title order={4}>Chăn nuôi</Title>
              <Divider />
              <Radio.Group mt={"md"} value={"animal-s"}>
                <Stack gap={"xs"}>
                  <Radio value="animal" label="Chứng nhận cấp theo vật nuôi" />
                  <Radio
                    value="animal-s"
                    label="Chứng nhận cấp theo giống vật nuôi"
                  />
                </Stack>
              </Radio.Group>
              <Group>
                <Button radius={4}>Thêm mới</Button>
              </Group>
              <Scrollable>
                <Group wrap="nowrap" gap="md">
                  {livestockData.map((animal) => (
                    <Card
                      key={animal.id}
                      withBorder
                      radius="md"
                      shadow="sm"
                      w={260}
                      h={360}
                    >
                      <Card.Section>
                        <Image
                          src={animal.image}
                          height={140}
                          alt={animal.name}
                        />
                      </Card.Section>

                      <Stack gap={4} mt="sm">
                        <Group justify="space-between">
                          <Text fw={600}>{animal.name}</Text>
                          <Badge size="sm" variant="light">
                            {animal.id}
                          </Badge>
                        </Group>

                        <Text size="sm">
                          <strong>Giống:</strong> {animal.seed}
                        </Text>
                        <Text size="sm">
                          <strong>Hình thức chăn nuôi:</strong>{" "}
                          {animal.harvestMethod}
                        </Text>
                        <Text size="sm">
                          <strong>Chu kỳ sinh trưởng:</strong>{" "}
                          {animal.growthCycle}
                        </Text>
                        <Text size="sm" c="dimmed">
                          <strong>Ghi chú:</strong> {animal.note}
                        </Text>
                      </Stack>

                      <ActionIcon
                        pos={"absolute"}
                        bottom={10}
                        right={10}
                        color="red"
                        variant="light"
                        radius={4}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Card>
                  ))}
                </Group>
              </Scrollable>
            </Stack>
          </Card>
        </Group> */}
        <Group justify="flex-end" mt="md">
          <Button radius={4}>Hoàn thành</Button>
        </Group>
      </Stack>
      <Modal
        title={"Tìm kiếm cây trồng"}
        opened={openedFilter}
        onClose={() => setOpenedFilter(false)}
        size={"lg"}
      >
        <Stack gap={"xs"}>
          <Select
            searchable
            clearable
            label="Nhóm cây trồng"
            radius={4}
            data={[
              "Cây ăn trái",
              "Cây lương thực",
              "Cây công nghiệp",
              "Cây thuốc",
            ]}
          />

          {treeType === "crop" ? (
            <Stack gap={"xs"}>
              <TextInput
                label="Cây trồng"
                leftSection={<IconSearch size={18} />}
                placeholder="Tìm kiếm cây trồng"
                radius={4}
              />
              <SeedCards selected="" seeds={seedOptions} onSelect={() => {}} />
            </Stack>
          ) : (
            <Stack gap={"xs"}>
              <TextInput
                label="Cây trồng"
                leftSection={<IconSearch size={18} />}
                placeholder="Tìm kiếm cây trồng"
                radius={4}
              />
              <SeedCards selected="" seeds={seedOptions} onSelect={() => {}} />
              <TextInput
                label="Giống cây trồng"
                leftSection={<IconSearch size={18} />}
                placeholder="Tìm kiếm giống cây trồng"
                radius={4}
              />
              <CropCards selected="" plants={cropOptions} onSelect={() => {}} />
            </Stack>
          )}
          <Group justify="flex-end">
            <Button radius={4} onClick={() => setOpenedFilter(false)}>
              Xác nhận
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
}
