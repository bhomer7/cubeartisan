/**
 * This file is part of CubeArtisan.
 *
 * CubeArtisan is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CubeArtisan is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with CubeArtisan.  If not, see <https://www.gnu.org/licenses/>.
 *
 * Modified from the original version in CubeCobra. See LICENSE.CubeCobra for more information.
 */
import React, { lazy, useContext } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, Row, Col, CardBody } from 'reactstrap';

import BlogPostPropType from '@cubeartisan/client/proptypes/BlogPostPropType.js';
import TimeAgo from '@cubeartisan/client/components/TimeAgo.js';
import UserContext from '@cubeartisan/client/components/contexts/UserContext.js';
import BlogContextMenu from '@cubeartisan/client/components/BlogContextMenu.js';
import Markdown from '@cubeartisan/client/components/markdown/Markdown.js';
import Suspense from '@cubeartisan/client/components/wrappers/Suspense.js';

const CommentsSection = lazy(() => import('@cubeartisan/client/components/CommentsSection.js'));

const BlogPost = ({ post, onEdit, noScroll }) => {
  const user = useContext(UserContext);

  const scrollStyle = noScroll ? {} : { overflow: 'auto', maxHeight: '50vh' };

  const canEdit = user && user._id === post.owner;

  return (
    <Card className="shadowed rounded-0 mb-3">
      <CardHeader className="pl-4 pr-0 pt-2 pb-0">
        <h5 className="card-title">
          <a href={`/cube/${post.cube}/blog/post/${post._id}`}>{post.title}</a>
          <div className="float-sm-right">
            {canEdit && <BlogContextMenu className="float-sm-right" post={post} value="..." onEdit={onEdit} />}
          </div>
        </h5>
        <h6 className="card-subtitle mb-2 text-muted">
          <a href={`/user/${post.owner}`}>{post.dev === 'true' ? 'Dekkaru' : post.username}</a>
          {' posted to '}
          {post.dev === 'true' ? (
            <a href="/dev/blog/0">Developer Blog</a>
          ) : (
            <a href={`/cube/${post.cube}`}>{post.cubename}</a>
          )}
          {' - '}
          <TimeAgo date={post.date} />
        </h6>
      </CardHeader>
      <div style={scrollStyle}>
        {post.markdown ? (
          <Row className="no-gutters">
            <Col className="col-l-7 col-m-6">
              <CardBody className="py-2">
                <Markdown markdown={post.markdown} limited />
              </CardBody>
            </Col>
          </Row>
        ) : (
          <CardBody className="py-2">
            <Markdown markdown={post.markdown} limited />
          </CardBody>
        )}
      </div>
      <div className="border-top">
        <Suspense>
          <CommentsSection parentType="blog" parent={post._id} collapse={false} />
        </Suspense>
      </div>
    </Card>
  );
};

BlogPost.propTypes = {
  post: BlogPostPropType.isRequired,
  onEdit: PropTypes.func.isRequired,
  noScroll: PropTypes.bool,
};

BlogPost.defaultProps = {
  noScroll: false,
};

export default BlogPost;
