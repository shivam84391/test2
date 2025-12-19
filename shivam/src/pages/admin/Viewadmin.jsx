import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const View = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { userId } = useParams(); // admin ke liye
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const url = isAdmin
        ? `${import.meta.env.VITE_API_URL}/api/admin/feedback/user/${userId}`
        : `${import.meta.env.VITE_API_URL}/api/users/my-feedbacks`;

      const res = await axios.get(url, { withCredentials: true });

      // admin vs user response handling
      setFeedbacks(
        isAdmin ? res.data.feedbacks || [] : res.data.data || []
      );
    } catch (err) {
      toast.error("Unable to load feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Header>
        <h2>
          {isAdmin ? "User Feedback Details" : "Your Submitted Feedback"}
        </h2>
        <p>
          {isAdmin
            ? "इस user द्वारा दी गई सभी प्रतिक्रियाएँ"
            : "आपके द्वारा दी गई सभी प्रतिक्रियाएँ"}
        </p>

        <BackBtn
          onClick={() =>
            navigate(isAdmin ? "/admin/dashboard" : "/user/feedback")
          }
        >
          ← Back
        </BackBtn>
      </Header>

      {loading ? (
        <Loader>Loading feedback...</Loader>
      ) : feedbacks.length === 0 ? (
        <Empty>No feedback found</Empty>
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

export default View;
