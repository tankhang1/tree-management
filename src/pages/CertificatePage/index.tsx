import { Button, Group, Stack, Title } from "@mantine/core";
import { IconFileExcel } from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";

import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";
type Certificate = {
  id: string; // ID duy nhất
  orgLogo: string; // Logo tổ chức chứng nhận (URL)
  orgName: string; // Tên tổ chức cấp
  certCode: string; // Mã số chứng nhận
  certName: string; // Tên chứng nhận
  issueDate: string; // Thời gian cấp (dd/mm/yyyy)
  validYears: number; // Thời gian hiệu lực (năm)
  definition: string; // Định nghĩa
  scopeType: "trong-trot" | "chan-nuoi"; // Phạm vi áp dụng
  scopeGroup: string; // Nhóm (VD: Cây ăn trái, Gia cầm...)
  scopeItem: string; // Mục cụ thể (VD: Sầu riêng Ri6, Gà ta...)
  criteriaHtml?: string; // Tiêu chí yêu cầu dạng HTML
  fileUrl?: string; // Link file chứng nhận (nếu upload PDF)
};

const certificateDataset: Certificate[] = [
  {
    id: "#4431223",
    orgLogo:
      "https://cdn.thuvienphapluat.vn/phap-luat/2022-2/HD/chung-nhan-vietgap.jpg",
    orgName: "Tổ chức VietGAP",
    certCode: "GCN-VG-2025-001",
    certName: "Chứng nhận VietGAP",
    issueDate: "01/08/2025",
    validYears: 3,
    definition:
      "VietGAP là bộ tiêu chuẩn thực hành sản xuất nông nghiệp tốt tại Việt Nam nhằm đảm bảo an toàn thực phẩm, bảo vệ môi trường và sức khỏe người lao động.",
    scopeType: "trong-trot",
    scopeGroup: "Cây ăn trái",
    scopeItem: "Sầu riêng Ri6",
    criteriaHtml:
      "<ul><li>Đảm bảo không sử dụng hóa chất cấm</li><li>Quy trình chăm sóc chuẩn</li></ul>",
    fileUrl: "https://example.com/chung-nhan-vietgap.pdf",
  },
  {
    id: "#6665234",
    orgLogo:
      "https://file.hstatic.net/200000423303/article/nn_huuco_8ad18ec91a174544837c5d06217ee34a_grande.jpg",
    orgName: "Tổ chức Organic Vietnam",
    certCode: "ORG-VN-2025-002",
    certName: "Chứng nhận Nông nghiệp hữu cơ",
    issueDate: "15/07/2025",
    validYears: 5,
    definition:
      "Chứng nhận hữu cơ đảm bảo sản phẩm được sản xuất mà không sử dụng hóa chất tổng hợp, phân bón hóa học và thuốc trừ sâu.",
    scopeType: "chan-nuoi",
    scopeGroup: "Gia cầm",
    scopeItem: "Gà ta thả vườn",
    criteriaHtml:
      "<p>Sản xuất theo quy trình hữu cơ, không sử dụng kháng sinh.</p>",
    fileUrl: "https://example.com/chung-nhan-huu-co.pdf",
  },
];

const CertificatePage = () => {
  const navigate = useNavigate();
  const certificateColumns: MRT_ColumnDef<Certificate>[] = [
    { accessorKey: "id", header: "Mã chứng nhận" },
    {
      accessorKey: "orgLogo",
      header: "Logo",
      Cell: ({ cell }) => (
        <img
          src={cell.getValue<string>()}
          alt="Logo"
          style={{ width: 40, height: 40, objectFit: "contain" }}
        />
      ),
    },
    { accessorKey: "orgName", header: "Tổ chức cấp" },
    { accessorKey: "certCode", header: "Mã số" },
    { accessorKey: "certName", header: "Tên chứng nhận" },
    { accessorKey: "issueDate", header: "Ngày cấp" },
    { accessorKey: "validYears", header: "Hiệu lực (năm)" },
    {
      accessorKey: "scopeType",
      header: "Phạm vi",
      Cell: ({ cell }) => {
        const value = cell.getValue<"trong-trot" | "chan-nuoi">();
        return (
          <span
            style={{
              padding: "2px 6px",
              borderRadius: 4,
              backgroundColor: value === "trong-trot" ? "#e0f7e9" : "#e3f2fd",
              color: value === "trong-trot" ? "#2e7d32" : "#1565c0",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {value === "trong-trot" ? "Trồng trọt" : "Chăn nuôi"}
          </span>
        );
      },
    },
    { accessorKey: "scopeGroup", header: "Nhóm" },
    { accessorKey: "scopeItem", header: "Đối tượng" },
    {
      accessorKey: "fileUrl",
      header: "Tài liệu",
      Cell: ({ cell }) => {
        const url = cell.getValue<string>();
        return url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Tải xuống
          </a>
        ) : (
          "-"
        );
      },
    },
  ];
  const onAddCertificate = () => {
    navigate(PATH.CERTIFICATION_ADD);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý giấy chứng nhận / chứng chỉ
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddCertificate}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={certificateColumns} data={certificateDataset} />
    </Stack>
  );
};
export default CertificatePage;
