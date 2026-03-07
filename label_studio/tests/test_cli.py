"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license."""

import pytest
from server import _create_user
from tests.utils import make_annotation, make_project, make_task

from label_studio.core.argparser import parse_input_args


@pytest.mark.django_db
def test_create_user():
    input_args = parse_input_args(['init', 'test', '--username', 'default@localhost', '--password', '12345678'])
    config = {}
    user = _create_user(input_args, config)
    assert user.om_through.filter(deleted_at__isnull=True).exists()


@pytest.mark.django_db
def test_user_organization_annotation_counters():
    from organizations.models import Organization

    input_args = parse_input_args(['init', 'test', '--username', 'default@localhost', '--password', '12345678'])
    user = _create_user(input_args, {})
    org = user.organizations.filter(organizationmember__deleted_at__isnull=True).first()

    project_config = dict(
        title='Test',
        is_published=True,
        label_config="""
                <View>
                  <Text name="location" value="$location"></Text>
                  <Choices name="text_class" choice="single">
                    <Choice value="class_A"></Choice>
                    <Choice value="class_B"></Choice>
                  </Choices>
                </View>""",
    )

    def make_test_project():
        project = make_project(project_config, user, False, org=org)
        task1 = make_task({'data': {'location': 'London', 'text': 'text A'}}, project)
        task2 = make_task({'data': {'location': 'London', 'text': 'text A'}}, project)
        make_annotation({'result': [{'result': [{'r': 1}], 'ground_truth': True}], 'completed_by': user}, task1.id)
        make_annotation({'result': [{'result': [{'r': 1}], 'ground_truth': True}], 'completed_by': user}, task1.id)
        make_annotation({'result': [{'result': [{'r': 1}], 'ground_truth': True}], 'completed_by': user}, task2.id)

    make_test_project()
    make_test_project()
    make_test_project()

    annotations = user.annotations.filter(project__organization=org)
    assert annotations.count() == 9
    assert annotations.values_list('project').distinct().count() == 3
