import React from 'react';
import { Input, Button, Layout, Row, Col } from 'antd';

const { Content } = Layout;

const HomePage = () => {
  return (
    <Layout style={{ height: '100vh', backgroundColor: '#000' }}>
      <Content>
        <Row justify="center" align="middle" style={{ height: '100%' }}>
          <Col span={8} style={{ textAlign: 'center', color: '#fff' }}>
            {/* Decorative Shape */}
            <div className="shape"></div>
          </Col>
          <Col span={8} style={{ textAlign: 'center', color: '#fff' }}>
            {/* Logo and Input Section */}
            <div style={{ border: '1px solid #fff', padding: '40px' }}>
              <h2>LOGO</h2>
              <p>Enter your instagram username</p>
              <Input
                placeholder="Username"
                style={{ marginTop: '10px', marginBottom: '20px', color: '#fff' }}
              />
            </div>
            {/* GitHub Button */}
            <Button
              type="primary"
              style={{
                marginTop: '20px',
                border: '1px solid #fff',
                backgroundColor: '#000',
                color: '#fff',
                width: '100px',
              }}
            >
              GITHUB
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default HomePage;