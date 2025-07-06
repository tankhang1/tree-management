import { Button, Card, Group, Image, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
const data = {
  templateCode: "TMP-01",
  imageUrl: "https://img.freepik.com/free-vector/tree_1308-36471.jpg",
  cultivationTechniques:
    "<ul><li>Trồng theo mô hình VietGAP</li><li>Bón phân hữu cơ định kỳ 3 tháng/lần</li></ul>",
  standards:
    "<p>Áp dụng tiêu chuẩn <strong>VietGAP</strong> và <em>GlobalGAP</em></p>",
  pestSolutions:
    "<p><strong>Rầy nâu:</strong> Sử dụng thuốc sinh học</p><p><strong>Thối rễ:</strong> Xử lý bằng vôi bột và thoát nước tốt</p>",
};
const PlantManagementTechnicalDocDetailPage = () => {
  const navigate = useNavigate();
  const {
    templateCode,
    imageUrl,
    cultivationTechniques,
    standards,
    pestSolutions,
  } = data;
  return (
    <Card withBorder radius="md" shadow="sm" p="xl">
      <Stack gap="md">
        <Group justify="space-between">
          <Group mb={"md"}>
            <Button
              variant="subtle"
              radius={4}
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Title order={3}>📘 Thông tin chi tiết tài liệu kỹ thuật</Title>
          </Group>
          <Text c="dimmed">Mã mẫu cây: {templateCode}</Text>
        </Group>

        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Ảnh minh hoạ"
            height={200}
            fit="contain"
            radius="md"
            style={{ border: "1px solid #ddd" }}
          />
        )}

        <Stack gap={4}>
          <Text fw={600}>🌿 Kỹ thuật canh tác</Text>
          <Text dangerouslySetInnerHTML={{ __html: cultivationTechniques }} />
        </Stack>

        <Stack gap={4}>
          <Text fw={600}>🏷️ Tiêu chuẩn chất lượng</Text>
          <Text dangerouslySetInnerHTML={{ __html: standards }} />
        </Stack>

        <Stack gap={4}>
          <Text fw={600}>🐛 Sâu bệnh & Giải pháp</Text>
          <Text dangerouslySetInnerHTML={{ __html: pestSolutions }} />
        </Stack>
      </Stack>
    </Card>
  );
};

export default PlantManagementTechnicalDocDetailPage;
