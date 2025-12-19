import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ViewFeedback = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/my-feedbacks`,
        { withCredentials: true }
      );
      setFeedbacks(res.data.data || []);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // not authenticated
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      toast.error("Unable to load feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Header>
        <h2>Your Submitted Feedback</h2>
        <p>आपके द्वारा दी गई सभी प्रतिक्रियाएँ</p>
        <BackBtn onClick={() => navigate("/user/feedback")}>
          ← Back to Feedback Form
        </BackBtn>
      </Header>

      {loading ? (
        <Loader>Loading feedback...</Loader>
      ) : feedbacks.length === 0 ? (
        <Empty>No feedback submitted yet</Empty>
      ) : (
        <Grid>
          {feedbacks.map((fb) => (
            <Card key={fb._id}>
              <Badge>{fb.feedbackType}</Badge>

              <Row><b>Lead ID:</b> {fb.leadId || "—"}</Row>
              <Row><b>Demat:</b> {fb.dematAccount?.name || "—"}</Row>
              <Row><b>Urgency:</b> {fb.urgencyLevel}</Row>

              <Divider />

              <Row><b>Name:</b> {fb.customerName}</Row>
              <Row><b>Mobile:</b> {fb.contactNumber}</Row>
              <Row><b>Email:</b> {fb.email}</Row>

              <Divider />

              <Row><b>Opening Mode:</b> {fb.openMode}</Row>
              <Row><b>Ease Rating:</b> ⭐ {fb.easeRating}</Row>
              <Row><b>Activation Rating:</b> ⭐ {fb.activationRating}</Row>

              {fb.guidance && (
                <TextBlock>
                  <b>Guidance:</b>
                  <p>{fb.guidance}</p>
                </TextBlock>
              )}

              {fb.documents && (
                <TextBlock>
                  <b>Documents:</b>
                  <p>{fb.documents}</p>
                </TextBlock>
              )}

              <Divider />

              <Row><b>Support Rating:</b> ⭐ {fb.supportRating}</Row>

              <Row>
                <b>Status:</b>
                <Status status={fb.status}>{fb.status}</Status>
              </Row>
              {fb.adminNote && (
                <TextBlock>
                  <b>Admin Note:</b>
                  <p>{fb.adminNote}</p>
                </TextBlock>
              )}

              {fb.technicalIssues && (
                <TextBlock>
                  <b>Technical Issues:</b>
                  <p>{fb.technicalIssues}</p>
                </TextBlock>
              )}

              <Divider />

              <Overall>
                Overall Rating ⭐ {fb.overallRating}
              </Overall>

              <Footer>
                Telecaller: {fb.telecallerName || "—"}
                <span>{new Date(fb.createdAt).toLocaleString()}</span>
              </Footer>
            </Card>
          ))}
        </Grid>
      )}
    </Wrapper>
  );
};

export default ViewFeedback;
const Wrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  padding: 2.5rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;

  h2 {
    font-size: 32px;
    font-weight: 800;
    color: #0f172a;
  }

  p {
    color: #475569;
    margin-top: 4px;
  }
`;

const BackBtn = styled.button`
  margin-top: 1rem;
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 700;
  cursor: pointer;
`;

const Loader = styled.div`
  text-align: center;
  font-size: 18px;
`;

const Empty = styled.div`
  text-align: center;
  font-size: 18px;
  color: #64748b;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.8rem;
`;

const Card = styled.div`
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 1.8rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  position: relative;
`;

const Badge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(90deg,#1e3a8a,#2563eb);
  color: white;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
`;

const Row = styled.div`
  font-size: 14px;
  margin-bottom: 6px;
`;

const Divider = styled.hr`
  margin: 12px 0;
  border: none;
  border-top: 1px solid #e2e8f0;
`;

const TextBlock = styled.div`
  margin-bottom: 10px;

  p {
    margin-top: 4px;
    font-size: 14px;
    color: #334155;
  }
`;

const Overall = styled.div`
  margin-top: 10px;
  font-size: 18px;
  font-weight: 800;
  color: #1e3a8a;
`;

const Footer = styled.div`
  margin-top: 14px;
  font-size: 12px;
  color: #475569;
  display: flex;
  justify-content: space-between;
`;

// Status badge (bold + color)
const Status = styled.span`
  display: inline-block;
  margin-left: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 13px;
  line-height: 1;
  color: ${(p) => (p.status === "APPROVED" ? "#065f46" : p.status === "REJECTED" ? "#7f1d1d" : "#7c2d12")};
  background: ${(p) =>
    p.status === "APPROVED"
      ? "rgba(16,185,129,0.12)" // green tint
      : p.status === "REJECTED"
      ? "rgba(239,68,68,0.08)" // red tint
      : "rgba(245,158,11,0.08)" // amber tint for pending
  };
  border: 1px solid
    ${(p) => (p.status === "APPROVED" ? "rgba(6,95,70,0.12)" : p.status === "REJECTED" ? "rgba(127,29,29,0.08)" : "rgba(124,45,18,0.08)")};
`;
