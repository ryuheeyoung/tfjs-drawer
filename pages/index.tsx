import Link from "next/link";
import Layout from "../components/Layout";

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href="/tutorials/2d-curve">
        <a>2D 데이터로 예측하기</a>
      </Link>
    </p>
  </Layout>
);

export default IndexPage;
